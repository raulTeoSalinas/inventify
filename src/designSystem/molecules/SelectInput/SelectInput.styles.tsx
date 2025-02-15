import styled from 'styled-components/native';


export const StyledButton = styled.TouchableOpacity.attrs({
  activeOpacity: 0.8,
})`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background-color: ${({ theme }) => theme.colors.backgroundContrast};
  border-radius: 24px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  padding-left: 12px;
  padding-right: 12px;
`;

export const FooterContainer = styled.View<{ paddingBottom: number }>`
 flex-direction: row;
 justify-content: space-evenly;
 align-items: center;
 gap: 10px;
 padding: 20px;
 padding-bottom: ${({ paddingBottom }) => paddingBottom}px;
 background-color: ${({ theme }) => theme.colors.background};
 border-left-width: 1px;
 border-right-width: 1px;
 border-color: ${({ theme }) => theme.colors.border};
`;

export const ItemContainer = styled.View`
  gap: 16px;
  justify-content: center;
  align-items: flex-start;
  padding-top: 16px;
`;