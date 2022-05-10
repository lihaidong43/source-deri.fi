
const basicSymbolConfig = {}

function importAll(r){
  return r.keys().forEach(key => {
    const path = key.split('.')
    console.log(path)
    const env = path[2]
    if(!basicSymbolConfig[env]) {
      basicSymbolConfig[env] = {}
    }
    basicSymbolConfig[env] = r(key)
  });
}
importAll(require.context('../config/',true,/apiconfig.*.json/));

export default function useSymbols(){
  const env = process.env.NODE_ENV === 'production' ? 'prod' : 'dev'
  return basicSymbolConfig[env];
}