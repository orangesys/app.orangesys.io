// @flow
import type { RouterProp } from '../lib/router'

type Props = {
  router: RouterProp,
}

const Home = (props: Props) => {
  props.router.redirectTo('/plan')
  return null
}

export default Home
