<template>
    <div class="fillcontain">
        <head-top></head-top>
        <el-form ref="form" :model="searchForm" label-width="80px" :inline="true" class="input-form">
            <el-form-item label="品牌">
                <el-select 
                    v-model="searchForm.brandList" 
                    multiple 
                    collapse-tags
                    placeholder="请选择" 
                    name="品牌">
                    <el-option v-for="item in brandOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="商场">
                <el-select 
                    v-model="searchForm.storeList" 
                    multiple 
                    collapse-tags
                    placeholder="请选择" 
                    name="商场">
                    <el-option v-for="item in storeNameOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="最小金额">
                <el-input v-model="searchForm.minPrice" placeholder="请输入金额(以元为单位)"></el-input>
            </el-form-item>
            <el-form-item label="最大金额">
                <el-input v-model="searchForm.maxPrice" placeholder="请输入金额(以元为单位)"></el-input>
            </el-form-item>
            <el-form-item label="最早日期">
                <el-date-picker
                    v-model="searchForm.startDate"
                    type="date"
                    placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
             <el-form-item label="最晚日期">
                <el-date-picker
                    v-model="searchForm.endDate"
                    type="date"
                    placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
             <el-form-item label="是否优惠">
                <el-select 
                    v-model="searchForm.hasDiscount" 
                    placeholder="请选择"
                    name="是否有优惠">
                    <el-option
                        v-for="item in hasDiscountOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="search('searchForm')">查询</el-button>
                <el-button>重置</el-button>
            </el-form-item>
        </el-form>
        <div class="table_container">
            <el-table :data="tableData" @expand='expand' :expand-row-keys='expendRow' :row-key='row=>row.index' style="width:100%">
                <el-table-column type="expand">
                     <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand" label-width="170px">
                            <el-form-item label="数据来源">
                                <span>{{ props.row.webChannel}}</span>
                            </el-form-item>
                            <el-form-item label="款式">
                                <span>{{ props.row.type}}</span>
                            </el-form-item>
                            <el-form-item label="规格">
                                <span>{{ props.row.size}}</span>
                            </el-form-item>
                            <el-form-item label="原价">
                                <span>{{ props.row.originPrice }}</span>
                            </el-form-item>
                            <el-form-item label="是否历史最低价">
                                <span>{{ props.row.lowestPriceFlag }}</span>
                            </el-form-item>
                            <el-form-item label="优惠力度">
                                <span>{{ props.row.discount }}</span>
                            </el-form-item>
                            <el-form-item label="优惠模式">
                                <span>{{ props.row.discountMode }}</span>
                            </el-form-item>
                            <el-form-item label="商场名称">
                                <span>{{ props.row.storeName }}</span>
                            </el-form-item>
                            <el-form-item label="爬虫触发时间">
                                <span>{{ props.row.createdDateTime }}</span>
                            </el-form-item>
                        </el-form>
                     </template>
                </el-table-column>
                <el-table-column label="品牌（英文）" prop="brandEn"></el-table-column>
                <el-table-column label="品牌（中文）" prop="brandZh"></el-table-column>
                <el-table-column label="商品名称" prop="title"></el-table-column>
                <el-table-column label="当前价格" prop="actualPrice"></el-table-column>
                <el-table-column label="商品图片">
                    <template  slot-scope="scope">
                         <img :src="scope.row.imgUrl" style="width:100px;height:100px">
                         <el-image 
                            :src="scope.row.imgUrl" 
                            :preview-src-list="scope.row.imgUrl"
                            style="width:100px;height:100px">
                         </el-image>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="block">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pagination.pageNo"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="pagination.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pagination.totalNum"
                style="margin:20px">
            </el-pagination>
        </div>
    </div>
</template>

<style>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .input-form{
    margin: 20px;

  }
</style>

<script>
  import headTop from '../../components/headTop'
  import {queryCrawledData, queryAllBrand, queryAllStoreName} from '@/api/getData'
  export default {
    components: {
    	headTop,
    },
    data() {
      return {
        //搜索选项——品牌
        brandOptions: [],
        //搜索选项——商场
        storeNameOptions: [],
        //是否存在优惠
        hasDiscountOptions:[
            {
                value: 1,
                label: '有优惠'
            },
            {
                value: 0,
                label: '无优惠'
            }

        ],
        //搜索选项——爬虫执行开始日期
        startDate: '',
        //搜索选项——爬虫执行结束日期
        endDate: '',
        //搜索条件表单
        searchForm:{
            pageNo: 1,
            pageSize: 20,
            brandList: null,
            storeList: null,
            startDate: null,
            endDate: null,
            hasDiscount: null,
            maxPrice: null,
            minPrice: null
        },
        //需要渲染到页面的结果集
        tableData:[],

        //分页相关数据
        pagination:{
            pageSize: 20,
            pageNo: 1,
            totalNum: 500
        },
      }
    },
    created(){
        this.search(this.searchForm);
        this.queryBrandSearchForm();
        this.queryStoreNameSearchForm();
    },
    methods:{
        async search(searchForm){
            const params = {
                ...this.searchForm
            }
            try{
                const resultData = await queryCrawledData(params);
                if(resultData.code == 200){
                    this.pagination.totalNum = resultData.data.totalNum;
                    this.tableData = [];
                    resultData.data.dataDetailList.forEach((item) => {
                        const data = {};
                        data.webChannel = item.webChannel;
                        data.brandZh = item.brandZh;
                        if(item.productType != null){
                            data.type = item.productType.join(',');
                        }
                        if(item.productSize != null){
                            data.size = item.productSize.join(', ');   
                        }
                        data.actualPrice = item.actualPrice;
                        data.originPrice = item.marketPrice;
                        if(item.lowestPriceFlag){
                            data.lowestPriceFlag = "是";
                        }else{
                            data.lowestPriceFlag = "否";
                        }
                        data.discount = (parseFloat(item.discountInfo.discount) * 10).toFixed(1) + "折";
                        if(item.discountInfo.discountModeList != null){
                            data.discountMode = item.discountInfo.discountModeList.join(', ');
                        }
                        data.storeName = item.storeName;
                        data.brandEn = item.brandEn;
                        data.title = item.title;
                        data.imgUrl = item.imgUrl;
                        data.createdDateTime = item.createdDateTime;
                        this.tableData.push(data);
                    })
                }else{
                    throw new Error(resultData.message)
                }
            }catch(err){
                this.$message({
                    type: 'error',
                    message: '获取爬虫聚合数据发生异常'
                });
            }
        },
        async queryBrandSearchForm(){
            try{
                const resultData = await queryAllBrand();
                if(resultData.code == 200){
                    resultData.data.forEach((item)=>{
                        const data = {};
                        data.value = item;
                        data.label = item;
                        this.brandOptions.push(data);
                    });
                }else{
                    throw new Error(resultData.message)
                }
            }catch(err){
                this.$message({
                    type: 'error',
                    message: '获取品牌选项卡数据发生异常'
                });
            }
        },
        async queryStoreNameSearchForm(){
           try{
                const resultData = await queryAllStoreName();
                if(resultData.code == 200){
                    resultData.data.forEach((item)=>{
                        const data = {};
                        data.value = item;
                        data.label = item;
                        this.storeNameOptions.push(data);
                    });
                }else{
                    throw new Error(resultData.message)
                }
            }catch(err){
                this.$message({
                    type: 'error',
                    message: '获取品牌选项卡数据发生异常'
                });
            } 
        },
        handleSizeChange(val){
            this.searchForm.pageNo = 1;
            this.searchForm.pageSize = val;
            this.search(this.searchForm);
            this.pagination.pageNo = this.searchForm.pageNo;
            this.pagination.pageSize = val;
        },
        handleCurrentChange(val){
            this.searchForm.pageNo = val;
            this.search(this.searchForm);
            this.pagination.pageNo = val;
            this.pagination.pageSize = this.searchForm.pageSize;
        }
    }
  }
</script>