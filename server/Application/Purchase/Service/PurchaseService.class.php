<?php

/*
 * @app Purchase
 * @package Purchase.service.Purchase
 * @author laofahai@TEam Swift
 * @link https://ng-erp.com
 * */
namespace Purchase\Service;
use Common\Service\CommonBillService;
use Home\Service\AppService;

class PurchaseService extends CommonBillService {

    protected $_auto = [
        ["user_id", "get_current_user_id", 1, "function"],
        ["company_id", "get_current_company_id", 1, "function"]
    ];

    const STATUS_COMPLETE = 2;

    // 单据主表模型别名 必须
    protected $main_model_alias = 'purchase.purchase';
    // 单据行模型别名 必须
    protected $detail_model_alias = 'purchase.purchaseDetail';
    // 主表外键字段
    protected $detail_main_foreign = 'purchase_id';
    // 主表表名
    protected $main_table = 'purchase';
    // 明细表表名
    protected $detail_table = 'purchase_detail';

    protected $LOCKED_STATUS = [
        self::STATUS_SAVED
    ];

    /*
     * 「工作流接口」
     * 转化为入库单
     * */
    public function convert_to_stock_in($id) {
        if(!AppService::is_app_active('storage')) {
            $this->error = sprintf(__('common.Need %s App Active'), 'storage');
            return false;
        }

        $meta_fields = ['quantity', 'subject', 'bill_no', 'remark'];
        $meta = [];

        $raw_main_data = $this->where(['id'=>$id])->find();

        foreach($raw_main_data as $field=>$value) {
            if(in_array($field, $meta_fields)) {
                $meta[$field] = $value;
            }
        }

        $meta['subject'] = __('purchase.Purchase stock in') . ' '. $meta['subject'];
        $meta['source_model'] = 'purchase.purchase';
        $meta['source_id'] = $id;
        $meta['workflow_id'] = DBC('purchase_stock_in_workflow');

        $row_model = D('Purchase/PurchaseDetail');
        $raw_rows_data = $row_model->where([
            'purchase_id' => $id
        ])->select();

        $stock_in_service = D('Storage/StockIn');
        $stock_in_id = $stock_in_service->add_bill($meta, $raw_rows_data);
        if(!$stock_in_id) {
            $this->error = $stock_in_service->getError();
            return false;
        }

        return $stock_in_id;
    }


}