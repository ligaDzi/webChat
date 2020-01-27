import styled from 'styled-components'

export const AbsoluteBlock = styled.div`
    position: absolute;
    top: 15px;
    bottom: 0;
    right: 30px;  
    overflow-y: hidden;
`

export const ListsSE = styled.ul`
    position: sticky;
    top: 0;
    padding: 0;
    margin: 0;
    text-align: right;
    overflow: auto;
`

export const ListItemSE = styled.li`
    font-size: 8px;
    cursor: default;
    transition: font-size 0.1s;
    color: ${props => props.color || 'inherit'}; 

    &:hover {
        font-size: 14px;  
    }

`

export const EndListItemSE = styled.li`
    font-size: 16px;
    cursor: default;

    &:hover {
        color: #24c851;
    }
`

export const LITooltipSE = styled.span`
    padding: 5px;
    color: ${props => props.color || 'inherit'};
`

export const MessageColor = styled.div`
    display: flex;
    padding-bottom: 15px;
    padding-right: 200px;
    color: ${props => props.color || 'inherit'};

    & h5 {
        display: block;
        margin: 0;
        padding-right: 10px;
    }

    & div {
        line-height: 1.8;
    }
`