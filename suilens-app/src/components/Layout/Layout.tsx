import { Outlet, useNavigate, useLocation, useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartLine, faExplosion, faDatabase, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { PAGE_ROUTES } from "../../common/constant";
import { COLORS } from "../../common/color";
import './Layout.scss'

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { packageAddress } = useParams();
  const { DASHBOARD, QUERY_EDITOR, HOME } = PAGE_ROUTES
  const isDashboard = location.pathname.includes("dashboard");
  const isEditor = location.pathname.includes("query-editor");
  const isHome = location.pathname.includes("home");

  return (
    <div className="layout-wrapper">
      <aside className="sidebar">
        <div className="logo">
          <FontAwesomeIcon icon={faExplosion} color={COLORS["BLACK-300"]} size="lg" />
        </div>
        <div className={`nav-link ${isDashboard ? "active" : ""}`} onClick={() => navigate(`${DASHBOARD}/${packageAddress}`)}>
          <FontAwesomeIcon icon={faChartLine} color={COLORS["BLACK-300"]} size="lg" />
        </div>
        <div
          className={`nav-link ${isEditor ? "active" : ""}`} onClick={() => navigate(`${QUERY_EDITOR}/${packageAddress}`)} >
          <FontAwesomeIcon icon={faDatabase} color={COLORS["BLACK-300"]} size="lg" />
        </div>
        <div
          className={`nav-link ${isHome ? "active" : ""}`} onClick={() => navigate(HOME)} >
          <FontAwesomeIcon icon={faRightFromBracket} color={COLORS["BLACK-300"]} size="lg" />
        </div>
      </aside>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
