const baseUlr = 'https://duojietiku.net/v1';

const url = {
  getSortType: baseUlr + '/auditParse/getSortType',
  getQuesData: baseUlr + '/auditParse/getQuesBySort',
  getQuesProblem: baseUlr + '/auditParse/feedback/list',
  uploadImg: baseUlr + '/library_upimg/upload/img',
  updateParse: baseUlr + '/auditParse/update',
  addQuesProblem: baseUlr + '/auditParse/feedback/sub',
  updateOption: baseUlr + '/auditParse/option',
  record: baseUlr + '/auditParse/record',
  addParse: baseUlr + '/auditParse/addParse',
  goLogin: baseUlr + '/auditParse/login',
  goRegister: baseUlr + '/auditParse/register',
  getUserInfo: baseUlr + '/auditParse/userInfo',
  editPassword: baseUlr + '/auditParse/password/change',
  // goRegister: 'http://47.102.40.118:8098/auditParse/register'
};

export {url};
