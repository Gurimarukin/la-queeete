import { apply } from 'fp-ts'
import { pipe } from 'fp-ts/function'
import readline from 'readline'

import { ClearPassword } from '../../shared/models/api/user/ClearPassword'
import type { Token } from '../../shared/models/api/user/Token'
import { UserName } from '../../shared/models/api/user/UserName'
import type { NotUsed } from '../../shared/utils/fp'
import { Future, List, Maybe, toNotUsed } from '../../shared/utils/fp'
import { futureMaybe } from '../../shared/utils/futureMaybe'

import { constants } from '../config/constants'
import type { JwtHelper } from '../helpers/JwtHelper'
import type { LoggerGetter } from '../models/logger/LoggerGetter'
import { TokenContent } from '../models/user/TokenContent'
import { User } from '../models/user/User'
import type { UserDiscordInfos } from '../models/user/UserDiscordInfos'
import { UserId } from '../models/user/UserId'
import { UserLoginPassword } from '../models/user/UserLogin'
import type { UserPersistence } from '../persistence/UserPersistence'
import { PasswordUtils } from '../utils/PasswordUtils'

type UserService = ReturnType<typeof UserService>

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function UserService(Logger: LoggerGetter, userPersistence: UserPersistence, jwtHelper: JwtHelper) {
  const logger = Logger('UserService')

  const { findById, addFavoriteSearch, removeFavoriteSearch, removeAllFavoriteSearches } =
    userPersistence

  const createUser = (
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
            createUser(UserName.wrap(userName), ClearPassword.wrap(password)),
            Future.filterOrElse(Maybe.isSome, () => Error('Failed to create user')),
            Future.map(toNotUsed),
          ),
    ),
  )

  return {
    createUser,
    createUserInteractive,

    verifyToken: (token: string): Future<TokenContent> =>
      jwtHelper.verify([TokenContent.codec, 'TokenContent'])(token),

    signToken,
    loginDiscord: (login: UserDiscordInfos): Future<Maybe<Token>> =>
      pipe(
        futureMaybe.Do,
        futureMaybe.apS('user', userPersistence.findByLoginDiscordId(login.id)),
        futureMaybe.bind('updated', ({ user }) =>
          futureMaybe.fromTaskEither(userPersistence.updateLoginDiscord(user.id, login)),
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
    addFavoriteSearch,
    removeFavoriteSearch,
    removeAllFavoriteSearches,
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
          // eslint-disable-next-line functional/no-expression-statement
          rl.close()
          return res
        },
      )
    }),
  )
