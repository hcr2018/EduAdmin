const getters = {
  app:state => state.app,
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.manager.token,
  avatar: state => state.manager.face,
  name: state => state.manager.Realname,
  introduction: state => state.manager.introduction,
  roles: state => state.manager.roles,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs
}
export default getters
