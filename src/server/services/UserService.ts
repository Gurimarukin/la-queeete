import { apply } from 'fp-ts'
import { pipe } from 'fp-ts/function'
import readline from 'readline'

import { ClearPassword } from '../../shared/models/api/user/ClearPassword'
import type { Token } from '../../shared/models/api/user/Token'
import { UserName } from '../../shared/models/api/user/UserName'
import type { NonEmptyArray, NotUsed } from '../../shared/utils/fp'
import { Future, List, Maybe, toNotUsed } from '../../shared/utils/fp'
import { futureMaybe } from '../../shared/utils/futureMaybe'

import { constants } from '../config/constants'
import type { JwtHelper } from '../helpers/JwtHelper'
import type { ChampionShardsLevel } from '../models/ChampionShardsLevel'
import type { LoggerGetter } from '../models/logger/LoggerGetter'
import type { SummonerId } from '../models/summoner/SummonerId'
import { TokenContent } from '../models/user/TokenContent'
import { User } from '../models/user/User'
import type { UserDiscordInfos } from '../models/user/UserDiscordInfos'
import { UserId } from '../models/user/UserId'
import { UserLoginDiscord, UserLoginPassword } from '../models/user/UserLogin'
import type { ChampionShardPersistence } from '../persistence/ChampionShardPersistence'
import type { UserPersistence } from '../persistence/UserPersistence'
import { PasswordUtils } from '../utils/PasswordUtils'

type UserService = Readonly<ReturnType<typeof UserService>>

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function UserService(
  Logger: LoggerGetter,
  championShardPersistence: ChampionShardPersistence,
  userPersistence: UserPersistence,
  jwtHelper: JwtHelper,
) {
  const logger = Logger('UserService')

  const {
    findById,
    updateLoginDiscord,
    addFavoriteSearch,
    removeFavoriteSearch,
    removeAllFavoriteSearches,
  } = userPersistence

  const createUserPassword = (
    userName: UserName,
    password: ClearPassword,
  ): Future<Maybe<User<UserLoginPassword>>> =>
    pipe(
      userPersistence.findByLoginUserName(userName),
      Future.chain(
        Maybe.fold(
          () =>
            pipe(
              apply.sequenceS(Future.ApplyPar)({
                id: Future.fromIOEither(UserId.generate),
                hashed: PasswordUtils.hash(password),
              }),
              Future.chain(({ id, hashed }) => {
                const user = User.of(
                  id,
                  UserLoginPassword.of(userName, hashed, Maybe.none),
                  List.empty,
                )
                return pipe(
                  userPersistence.create(user),
                  Future.map(success => (success ? Maybe.some(user) : Maybe.none)),
                )
              }),
            ),
          () => futureMaybe.none,
        ),
      ),
    )

  const createUserInteractive: Future<NotUsed> = pipe(
    Future.fromIOEither(logger.info('Creating user')),
    Future.chain(() =>
      apply.sequenceT(Future.taskEitherSeq)(
        prompt('userName: '),
        prompt('password: '),
        prompt('confirm password: '),
      ),
    ),
    Future.chain(([userName, password, confirm]) =>
      password !== confirm
        ? Future.left(Error('Passwords must be the same'))
        : pipe(
            createUserPassword(UserName.wrap(userName), ClearPassword.wrap(password)),
            Future.filterOrElse(Maybe.isSome, () => Error('Failed to create user')),
            Future.map(toNotUsed),
          ),
    ),
  )

  return {
    createUserDiscord: (discord: UserDiscordInfos): Future<Maybe<User<UserLoginDiscord>>> =>
      pipe(
        userPersistence.findByLoginDiscordId(discord.id),
        Future.chain(
          Maybe.fold(
            () =>
              pipe(
                Future.fromIOEither(UserId.generate),
                Future.chain(id => {
                  const user = User.of(id, UserLoginDiscord.of(discord), List.empty)
                  return pipe(
                    userPersistence.create(user),
                    Future.map(success => (success ? Maybe.some(user) : Maybe.none)),
                  )
                }),
              ),
            () => futureMaybe.none,
          ),
        ),
      ),
    createUserPassword,
    createUserInteractive,

    verifyToken: (token: string): Future<TokenContent> =>
      jwtHelper.verify([TokenContent.codec, 'TokenContent'])(token),

    signToken,
    loginDiscord: (login: UserDiscordInfos): Future<Maybe<Token>> =>
      pipe(
        futureMaybe.Do,
        futureMaybe.apS('user', userPersistence.findByLoginDiscordId(login.id)),
        futureMaybe.bind('updated', ({ user }) =>
          futureMaybe.fromTaskEither(
            userPersistence.updateLoginDiscord(user.id, UserLoginDiscord.of(login)),
          ),
        ),
        futureMaybe.filter(({ updated }) => updated),
        futureMaybe.chainTaskEitherK(({ user }) => signToken({ id: user.id })),
      ),
    loginPassword: (userName: UserName, clearPassword: ClearPassword): Future<Maybe<Token>> =>
      pipe(
        futureMaybe.Do,
        futureMaybe.apS('user', userPersistence.findByLoginUserName(userName)),
        futureMaybe.bind('validPassword', ({ user }) =>
          futureMaybe.fromTaskEither(PasswordUtils.check(user.login.password, clearPassword)),
        ),
        futureMaybe.filter(({ validPassword }) => validPassword),
        futureMaybe.chainTaskEitherK(({ user }) => signToken({ id: user.id })),
      ),

    findById,
    updateLoginDiscord,
    addFavoriteSearch,
    removeFavoriteSearch,
    removeAllFavoriteSearches,
    listChampionShardsForSummoner: championShardPersistence.listForSummoner,
    setChampionsShardsForSummonerBulk: (
      user: UserId,
      summoner: SummonerId,
      champions: NonEmptyArray<ChampionShardsLevel>,
    ): Future<boolean> => {
      const { left: toUpsert, right: toDelete } = pipe(
        champions,
        List.partition(c => c.shardsCount === 0),
      )
      return championShardPersistence.bulkDeleteAndUpsert(user, summoner, { toDelete, toUpsert })
    },
  }

  function signToken(content: TokenContent): Future<Token> {
    return jwtHelper.sign(TokenContent.codec)(content, { expiresIn: constants.account.tokenTtl })
  }
}

export { UserService }

const prompt = (label: string): Future<string> =>
  pipe(
    Future.tryCatch(() => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      })
      return new Promise<string>(resolve => rl.question(label, answer => resolve(answer))).then(
        res => {
          // eslint-disable-next-line functional/no-expression-statements
          rl.close()
          return res
        },
      )
    }),
  )
