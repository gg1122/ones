(function(window, angular, ones) {

    //angular.module('ones.global', [])
    ones.global_module
        .service('Home.CommonTypeAPI', [
            'ones.dataApiFactory',
            'pluginExecutor',
            function(dataAPI, plugin) {

                var self = this;

                this.modules_map = {};

                this.resource = dataAPI.getResourceInstance({
                    uri: 'home/commonType',
                    extra_methods: ['api_get', 'api_query']
                });

                this.config = {
                    app: 'home',
                    module: 'commonType',
                    table: 'common_type',
                    fields: {
                        company: {
                            addable: false,
                            editable: false
                        },
                        module: {
                            widget: 'select',
                            data_source: [],
                            get_display: function(value) {
                                return self.modules_map[value];
                            }
                        }
                    },
                    list_display: ['name', 'alias', 'module', 'listorder'],
                    filters: {
                        module: {
                            type: 'link'
                        }
                    }
                };

                plugin.callPlugin('common_type_module');
                var modules = ones.pluginScope.get('common_type_module');
                if(modules) {
                    this.config.fields.module.data_source = modules;
                    angular.forEach(modules, function(item) {
                        self.modules_map[item.value] = item.label;
                    });
                }

                this.get_types_by_module = function(module_name) {
                    return self.resource.api_query({
                        _mf: 'module',
                        _mv: module_name
                    }).$promise;
                };
            }
        ])
    ;

})(window, window.angular, window.ones);