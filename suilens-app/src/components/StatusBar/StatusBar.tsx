import './StatusBar.scss';

const StatusBar = () => {
  return (
    <div className="status-bar">
      <div className="status-bar-content">
        <span className="network-indicator">
          <span className="indicator-dot"></span>
          We are currently live in testnet
        </span>
      </div>
    </div>
  );
};

export default StatusBar;