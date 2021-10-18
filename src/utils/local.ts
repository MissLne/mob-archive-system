const localStore = {
  setData(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
  },
  getData(key: string) {
    return JSON.parse(localStorage.getItem(key) || '[]');

  }
}

export default localStore