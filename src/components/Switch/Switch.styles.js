import styled from 'styled-components'

export const Track = styled.button`
  position: relative;
  width: 40px;
  height: 22px;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radius.full};
  border: none;
  background: ${({ $isOn, theme }) => ($isOn ? theme.color.border : theme.color.textFaint)};
  padding: 0;
  transition: background 0.2s ease;
`

export const Thumb = styled.span`
  position: absolute;
  top: 2px;
  left: ${({ $isOn }) => ($isOn ? '20px' : '2px')};
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: ${({ theme }) => theme.color.surface};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  transition: left 0.2s ease;
`
