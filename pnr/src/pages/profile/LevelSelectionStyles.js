import styled from 'styled-components';

export const LevelList = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column; /* Change to row for a horizontal list */
  margin: 20px 0;
`;

export const LevelItem = styled.li`
  cursor: pointer;
  padding: 10px 15px;
  margin: 5px 0;
  border-radius: 5px;
  background-color: ${props => props.$isActive ? '#6d6a66' : 'transparent'};
  color: ${props => props.$isActive ? '#ffffff' : '#c1c4c9'};
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: #5e5a56;
    color: #ffffff;
  }
`;

