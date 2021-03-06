(function(window, angular, ones){
    'use strict';

    // 注册至工作流服务API
    ones.pluginRegister('bpm_service_api', function(injector, defered) {
        // 转化为出库单
        ones.pluginScope.append('bpm_service_api', {
            label: _('storage.Convert to stock out'),
            value: _('sale.orders.convert_to_stock_out'),
            module: 'sale.orders'
        });
    });

    // 注册至支持工作流中修改的字段
    ones.pluginRegister('bpm_editable_fields_sale.orders', function() {
        var fields = [
            {
                widget: 'select',
                field: 'status',
                data_source: [
                    {value: -1, label: _('common.No Data')},
                    {value: 0, label: _('sale.ORDERS_STATUS_NEW')},
                    {value: 1, label: _('sale.ORDERS_STATUS_SAVED')},
                    {value: 2, label: _('sale.ORDERS_STATUS_COMPLETE')}
                ]
            },
            {
                field: 'remark'
            }
        ];
        ones.pluginScope.set('bpm_editable_fields', fields);
    });

    // 注册至配置字段
    ones.pluginRegister('common_config_item', function(injector, defered, fields) {
        if(is_app_loaded('storage')) {
            // 销售出库工作流
            ones.pluginScope.append('common_config_item', {
                alias: 'sale_stock_out_workflow',
                label: _('sale.Sale orders stock out workflow'),
                widget: 'select',
                data_source: 'Bpm.WorkflowAPI',
                data_source_query_param: {
                    _mf: 'module',
                    _mv: 'storage.stockOut'
                },
                app: 'storage'
            });
            ones.pluginScope.append('common_config_item', {
                alias: 'sale_stock_out_workflow_opts',
                widget: 'hidden',
                value: 'sale,integer',
                app: 'storage'
            });
        }
    });

})(window, window.angular, window.ones);