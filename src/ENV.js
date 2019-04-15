const ENV = {
  development: {
    API_DOMAIN: "https://zeus-stage.meiwu365.com",
    PASSWORD_DOMAIN: "https://account-stage.meiwu365.com"
  },
  production: {
    API_DOMAIN: "https://zeus.dabanjia.com",
    PASSWORD_DOMAIN: "https://sys.dabanjia.com"
  }
};
// eslint-disable-next-line no-undef
export default ENV[process.env.NODE_ENV];
