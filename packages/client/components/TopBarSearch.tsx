import styled from '@emotion/styled'
import Atmosphere from 'Atmosphere'
import graphql from 'babel-plugin-relay/macro'
import useAtmosphere from 'hooks/useAtmosphere'
import useRouter from 'hooks/useRouter'
import React, {useRef} from 'react'
import {createFragmentContainer} from 'react-relay'
import {matchPath, RouteProps} from 'react-router'
import {commitLocalUpdate} from 'relay-runtime'
import {PALETTE} from 'styles/paletteV2'
import {TopBarSearch_viewer} from '__generated__/TopBarSearch_viewer.graphql'
import Icon from './Icon'

const getShowSearch = (location: NonNullable<RouteProps['location']>) => {
  const {pathname} = location
  return (
    pathname.includes('/me/tasks') ||
    !!matchPath(pathname, {
      path: '/team/:teamId',
      exact: true,
      strict: true
    })
  )
}
interface Props {
  viewer: TopBarSearch_viewer | null
}

const Wrapper = styled('div')<{location: any}>(({location}) => ({
  alignItems: 'center',
  backgroundColor: 'hsla(0,0%,100%,.125)',
  display: 'flex',
  margin: 12,
  width: 480,
  visibility: getShowSearch(location) ? undefined : 'hidden'
}))

const SearchInput = styled('input')({
  appearance: 'none',
  border: '1px solid transparent',
  color: PALETTE.TEXT_LIGHT,
  fontSize: 20,
  lineHeight: '24px',
  margin: 0,
  outline: 0,
  padding: '12px 16px',
  backgroundColor: 'transparent',
  width: '100%'
})

const SearchIcon = styled(Icon)({
  color: '#fff',
  cursor: 'pointer',
  padding: 12
})

const setSearch = (atmosphere: Atmosphere, value: string) => {
  commitLocalUpdate(atmosphere, (store) => {
    const viewer = store.getRoot().getLinkedRecord('viewer')
    if (!viewer) return
    viewer.setValue(value, 'dashSearch')
  })
}

const TopBarSearch = (props: Props) => {
  const {viewer} = props
  const dashSearch = viewer?.dashSearch ?? ''
  const inputRef = useRef<HTMLInputElement>(null)
  const atmosphere = useAtmosphere()
  const {location} = useRouter()
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(atmosphere, e.target.value)
  }
  const icon = dashSearch ? 'close' : 'search'
  const onClick = () => {
    setSearch(atmosphere, '')
    inputRef.current?.focus()
  }
  return (
    <Wrapper location={location}>
      <SearchInput ref={inputRef} onChange={onChange} placeholder={'Search'} value={dashSearch} />
      <SearchIcon onClick={onClick}>{icon}</SearchIcon>
    </Wrapper>
  )
}

export default createFragmentContainer(TopBarSearch, {
  viewer: graphql`
    fragment TopBarSearch_viewer on User {
      dashSearch
    }
  `
})
