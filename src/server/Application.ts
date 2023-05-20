import { pipe } from 'fp-ts/function'

import { MsDuration } from '../shared/models/MsDuration'
import type { NotUsed } from '../shared/utils/fp'
import { IO } from '../shared/utils/fp'

import type { Context } from './Context'
import { HealthCheckController } from './controllers/HealthCheckController'
import { MadosayentisutoController } from './controllers/MadosayentisutoController'
import { StaticDataController } from './controllers/StaticDataController'
import { SummonerController } from './controllers/SummonerController'
import { UserController } from './controllers/UserController'
import { Routes } from './webServer/Routes'
import { startWebServer } from './webServer/startWebServer'
import { RateLimiter } from './webServer/utils/RateLimiter'
import { WithAuth } from './webServer/utils/WithAuth'
import { WithIp } from './webServer/utils/WithIp'

const rateLimiterLifeTime = MsDuration.days(1)

export const Application = ({
  config,
  Logger,
  ddragonService,
  discordService,
  healthCheckService,
  summonerService,
  masteriesService,
  activeGameService,
  staticDataService,
  userService,
}: Context): IO<NotUsed> => {
  const logger = Logger('Application')

  const withIp = WithIp(Logger, config)

  const healthCheckController = HealthCheckController(healthCheckService)
  const staticDataController = StaticDataController(ddragonService, staticDataService)
  const summonerController = SummonerController(
    summonerService,
    masteriesService,
    activeGameService,
    userService,
  )
  const userController = UserController(
    Logger,
    ddragonService,
    discordService,
    summonerService,
    masteriesService,
    userService,
  )

  const madosayentisutoController = MadosayentisutoController(
    config.madosayentisuto,
    withIp,
    ddragonService,
    masteriesService,
    summonerService,
    userService,
    staticDataController,
  )

  const rateLimiter = RateLimiter(Logger, withIp, rateLimiterLifeTime)
  const withAuth = WithAuth(userService)

  const routes = Routes(
    rateLimiter,
    withAuth,
    healthCheckController,
    madosayentisutoController,
    staticDataController,
    summonerController,
    userController,
  )

  return pipe(
    startWebServer(Logger, config.http, routes),
    IO.chain(() => logger.info('Started')),
  )
}
