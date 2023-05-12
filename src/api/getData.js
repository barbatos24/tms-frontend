import fetch from '@/config/fetch'

/**
 * 登陆
 */

export const login = data => fetch('/userApi/login', data, 'POST');

/**
 * 退出
 */

export const signout = () => fetch('/admin/signout');

/**
 * 执行爬虫脚本
 */
export const executeSpiderScript = data => fetch('/spiderApi/crawlBaiLianCommodityInfo', data, 'POST');

/**
 * 查询爬取到的商品数据
 */
export const queryCrawledData = data => fetch('/spiderApi/queryCrawledData', data, 'POST');

/**
 * 查询所有品牌
 */
export const queryAllBrand = () => fetch('/spiderApi/queryAllBrand');

/**
 * 查询所有商场名称
 */
export const queryAllStoreName = () => fetch('/spiderApi/queryAllStoreName');
