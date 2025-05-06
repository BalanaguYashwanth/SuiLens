import { AuthService } from "../../common/zklogin/authService";

const SuiZkLogin = ({ name, coverImg }: {name: string, coverImg: string}) => {
  const authService = new AuthService();
  if (name && coverImg) {
    return (
      <div
        className="d-flex justify-content-center flex-column text-center"
        style={{ background: "#000", minHeight: "100vh" }}
      >
        <div className="mt-auto text-light mb-5">
          <div
            className=" ratio ratio-1x1 mx-auto mb-2"
            style={{ maxWidth: "320px" }}
          >
            <img src={coverImg} alt="" width={30} height={30} />
          </div>
          <h1>{name}</h1>
          <p>Please login with your Google account to create a SUI account for you</p>
          <button
            onClick={() => authService.login()}
            className="rounded-pill px-3 mt-3"
          >
            Login with Google
          </button>
        </div>
        <p className="mt-auto text-secondary">Powered by SUI</p>
      </div>
    );
  }
  return null;
};

SuiZkLogin.defaultProps = {
  name: "",
};

export default SuiZkLogin;

