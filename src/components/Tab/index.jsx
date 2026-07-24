import { TabList, TabButton } from './Tab.styles'

export const Tabs = ({ children }) => <TabList>{children}</TabList>

export const Tab = ({ isActive, onClick, children }) => (
  <TabButton type="button" $isActive={isActive} onClick={onClick}>
    {children}
  </TabButton>
)
