const configLoader = process.env.NODE_ENV === 'production'
  ? require('./prod/app.config').default
  : require('./dev/app.config').default

export default configLoader

