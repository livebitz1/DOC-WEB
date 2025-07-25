
import React from 'react';
import styled from 'styled-components';

const RefreshButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <StyledWrapper>
      <button className="button" type="button" onClick={onClick} title="Refresh chat list" aria-label="Refresh chat list">
        <span className="button__text">Refresh</span>
        <span className="button__icon"><svg xmlns="http://www.w3.org/2000/svg" width={48} viewBox="0 0 48 48" height={48} className="svg"><path d="M35.3 12.7c-2.89-2.9-6.88-4.7-11.3-4.7-8.84 0-15.98 7.16-15.98 16s7.14 16 15.98 16c7.45 0 13.69-5.1 15.46-12h-4.16c-1.65 4.66-6.07 8-11.3 8-6.63 0-12-5.37-12-12s5.37-12 12-12c3.31 0 6.28 1.38 8.45 3.55l-6.45 6.45h14v-14l-4.7 4.7z" /><path fill="none" d="M0 0h48v48h-48z" /></svg></span>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .button {
    position: relative;
    width: 150px;
    height: 40px;
    cursor: pointer;
    display: flex;
    align-items: center;
    border: 1px solid #0078E8;
    background-color: #0082FC;
    overflow: hidden;
  }

  .button, .button__icon, .button__text {
    transition: all 0.3s;
  }

  .button .button__text {
    transform: translateX(30px);
    color: #fff;
    font-weight: 600;
  }

  .button .button__icon {
    position: absolute;
    transform: translateX(109px);
    height: 100%;
    width: 39px;
    background-color: #0078E8;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .button .svg {
    width: 20px;
    fill: #fff;
  }

  .button:hover {
    background: #0078E8;
  }

  .button:hover .button__text {
    color: transparent;
  }

  .button:hover .button__icon {
    width: 148px;
    transform: translateX(0);
  }

  .button:active .button__icon {
    background-color: #006cd0;
  }

  .button:active {
    border: 1px solid #006cd0;
  }
`;

export default RefreshButton;
