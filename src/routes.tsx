import React, { Suspense } from 'react'
import { Router } from '@reach/router'
import Authorized from 'pages/Authorized'

import { Loading } from 'components/Loading'

import NotFound from 'pages/NotFound'
import SignIn from 'pages/SignIn'
import SignUp from 'pages/SignUp'
import Settings from 'pages/Settings'
import ServerSetup from 'pages/ServerSetup'
import Plan from 'pages/Plan'
import DB from 'pages/DashBoard/DB'
import BaseInfo from 'pages/BaseInfo'
import OrderPlan from 'pages/OrderPlan'
import Graph from 'pages/DashBoard/Graph'
import DashBoard from 'pages/DashBoard'
import VerificationGuide from 'pages/VerificationGuide'
import { Guarder } from 'pages/Guarder'

export const routes = {
  SignIn: '/sign-in',
  SignUp: 'sign-up',
  BaseInfo: '/base-info',
  VerificationGuide: '/verification-guide',
  OrderPlan: '/order-plan',
  ServerSetup: '/server-setup',
  DashBoard: '/',
  DashBoardPlan: '/plan',
  DashBoardGraph: '/graph',
  DashBoardDB: '/db',
  DashBoardInquiry: '/inquiry',
  Settings: '/settings',
}
export const routeTitles = {
  [routes.BaseInfo]: '基本情報',
  [routes.VerificationGuide]: 'メールアドレスの認証',
  [routes.OrderPlan]: 'プランの選択',
  [routes.ServerSetup]: 'サーバーセットアップ',
  [routes.DashBoard]: 'ホーム',
  [routes.DashBoardPlan]: 'プラン',
  [routes.DashBoardGraph]: 'Graph',
  [routes.DashBoardDB]: 'TSDB',
  [routes.DashBoardInquiry]: 'お問い合わせ',
  [routes.Settings]: '設定',
}

export const Routes = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Router>
        <Authorized path="/">
          <Guarder path="/">
            <DashBoard path={routes.DashBoard} />
            <ServerSetup path={routes.ServerSetup} />
            <Graph path={routes.DashBoardGraph} />
            <DB path={routes.DashBoardDB} />
            <Plan path={routes.DashBoardPlan} />
            <Settings path={routes.Settings} />
          </Guarder>

          <BaseInfo path={routes.BaseInfo} />
          <VerificationGuide path={routes.VerificationGuide} />
          <OrderPlan path={routes.OrderPlan} />
          <NotFound default />
        </Authorized>

        <SignIn path={routes.SignIn} />
        <SignUp path={routes.SignUp} />

        <NotFound default />
      </Router>
    </Suspense>
  )
}
