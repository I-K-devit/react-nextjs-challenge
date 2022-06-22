import styled from '@emotion/styled';

export const SearchStyled = styled.input`
    padding: 0px;
    background-color: black;
    font-size: 24px;
    border-radius: 4px;
    color: white;
`;

export const ButtonStyled = styled.button`
    border: 1px solid #eaeaea;
    border-radius: 10px;
`;

export const ArticleStyled = styled.div`
    display: flex;
    max-width: 1000px;
    min-width: 1000px;
    margin: 1rem;
    flex-basis: 45%;
    padding: 1rem;
    text-align: left;
    color: inherit;
    text-decoration: none;
    border: 1px solid #eaeaea;
    border-radius: 10px;
    transition: color 0.15s ease, border-color 0.15s ease;
`;

export const DeleteButtonStyled = styled.button`
top: 0px;
height: 25px;
width: 60px;
opacity: 0;
border: 1px solid #eaeaea;
border-radius: 10px;
&:hover {
    opacity: 100;
}
`;