'use strict';

var underscore = angular.module('underscore', []);
underscore.factory('_', ['$window', function ($window) {
  return $window._; // assumes underscore has already been loaded on the page
}]);

angular.module('upgradeManager',
  ['ngRoute', 'pascalprecht.translate', 'ui.router', 'underscore',
    'ui.bootstrap', 'xeditable', 'ngVis',
    'ui.bootstrap.tpls', 'ui.map', 'chart.js',
    'ui.grid', 'ui.grid.resizeColumns', 'ui.grid.pagination', 'ui.grid.edit', 'ui.grid.pagination',
    'ui.grid.selection', 'ui.grid.exporter', 'checklist-model', 'ui.bootstrap.showErrors',
    'xeditable', 'toggle-switch', 'nvd3', 'ngRadialGauge',
    'upgradeManager.controllers', 'upgradeManager.directives', 'upgradeManager.filters',
    'upgradeManager.services', 'ui.bootstrap.datetimepicker',
      'remoteValidation', 'LocalStorageModule', 'moment-picker', 'angular-elastic-builder',
      'angularMoment', 'baiduMap', 'btford.socket-io'])
  .config(['$routeProvider', '$translateProvider',
    '$locationProvider', 'uiMapLoadParamsProvider',
    '$stateProvider', '$urlRouterProvider',
      'localStorageServiceProvider', 'mapScriptServiceProvider', '$qProvider',

    function ($routeProvider, $translateProvider,
              $locationProvider, uiMapLoadParamsProvider,
              $stateProvider, $urlRouterProvider, localStorageServiceProvider, mapScriptServiceProvider, $qProvider){
      if (window.history && window.history.pushState) {
        $locationProvider.html5Mode(true);
      }
      localStorageServiceProvider.setPrefix('upgradeManager');
        mapScriptServiceProvider.setKey('BwkWVEfsahCUuRZWFdeEDT4V');

      $urlRouterProvider.otherwise("/default");

      $stateProvider
        .state('default', {
          url: "/",
          templateUrl: "partial/dashboard.ejs",
          controller: 'DashboardController',
          authenticate: true
        })

        .state('login', {
          url: "/login",
          controller: 'LoginController'
        })

        .state('dashboard', {
          url: "/dashboard",
          templateUrl: "partial/dashboard.ejs",
          controller: 'DashboardController',
          authenticate: true
        })

          .state('dashboardSubnav', {
              url: "/dashboard/:subnav",
              templateUrl: "partial/dashboard.ejs",
              controller: 'DashboardController',
              authenticate: true
          })


        .state('assetsSubnav', {
          url: "/assets/:subnav/:probe/:iface",
          templateUrl: "partial/assets.ejs",
          controller: 'AssetsController',
          authenticate: true
        })

        .state('monitorSubnav', {
          url: "/monitor/:subnav/:probe/:iface",
          templateUrl: "partial/monitor.ejs",
          controller: 'MonitorController',
          authenticate: true
        })

        .state('flowsSubnav', {
          url: "/flows/:subnav/:probe/:iface",
          templateUrl: "partial/flows.ejs",
          controller: 'FlowsController',
          authenticate: true
        })

        .state('controlDevicesSubnav', {
          url: "/controlDevices/:subnav/:probe/:iface",
          templateUrl: "partial/controlDevices.ejs",
          controller: 'ControlDevicesController',
          authenticate: true
        })

        .state('pageAdminSubnav', {
          url: "/pageAdmin/:subnav/:probe/:iface",
          templateUrl: "partial/pageAdmin.ejs",
          controller: 'PageAdminController',
          authenticate: true
        })
          .state('pageAdminProbe', {
              url: "/pageAdmin/probe",
              templateUrl: "partial/pageAdmin.ejs",
              controller: 'PageAdminController',
              authenticate: true
          })
      ;

      uiMapLoadParamsProvider.setParams({
        v: '2.0',
        ak: 'BwkWVEfsahCUuRZWFdeEDT4V'// your map's develop key
      });

      $translateProvider.translations('en',
        {
            "*": "Any",

          "@timestamp": "timestamp",
          "IN_SRC_MAC": "Source MAC",
          "OUT_DST_MAC": "Destination MAC",
          "IN_SRC_OS": "Source OS",
          "OUT_DST_OS": "Destination OS",
          "IPV4_SRC_ADDR": "Source IP",
          "IPV4_DST_ADDR": "Destination IP",
          "L4_SRC_PORT": 'Source Port',
          "L4_DST_PORT": 'Destination Port',
          "PROTOCOL": 'L4 Protocol',
          "L7_PROTO": 'L7 Protocol',
          "L7_PROTO_NAME": "L7 Protocol Name",
          "TCP_FLAGS": 'TCP FLAGS',
          "IN_PKTS": 'In Packets',
          "IN_BYTES": 'In Bytes',
          "OUT_PKTS": 'Out Packets',
          "OUT_BYTES": 'Out Bytes',
          "HTTP_HOST": "HTTP Host",
          "HTTP_URL": "HTTP Url",
          "HTTP_METHOD": "HTTP Method",
          "HTTP_RET_CODE": 'HTTP Return Code',

          'LAST_MINUTE': 'LAST MINUTE',
            'LAST_TEN_MINUTE' : 'LAST 10 MINUTES',
          'LAST_HOUR': 'LAST HOUR',
          'LAST_DAY': 'LAST DAY',
          'LAST_WEEK': 'LAST WEEK',
          'LAST_MONTH': 'LAST MONTH',
          'LAST_QUATER': 'LAST QUATER',
          'LAST_YEAR': 'LAST YEAR',

            'SECOND': 'SECOND',
          'MINUTE': 'MINUTE',
          'HOUR': 'HOUR',
          'DAY': 'DAY',
          'WEEK': 'WEEK',
          'MONTH': 'MONTH',
          'QUATER': 'QUATER',
          'YEAR': 'YEAR',

          'ONE_SECOND_LAST_MINUTE': 'EVERY SECOND LAST MINUTE',
            'ONE_MINUTE_LAST_TEN_MINUTE': 'VERY MINUTE LAST 10 MINUTES',
          'ONE_MINUTE_LAST_HOUR': 'EVERY MINUTE LAST HOUR',
          'ONE_HOUR_LAST_DAY': 'EVERY HOUR LAST DAY',
          'ONE_HOUR_LAST_WEEK': 'EVERY HOUR LAST WEEK',
          'ONE_DAY_LAST_WEEK': 'EVERY DAY LAST WEEK',
          'ONE_DAY_LAST_MONTH': 'EVERY DAY LAST MONTH',
          'ONE_DAY_LAST_QUATER': 'EVERY DAY LAST QUATER',
          'ONE_WEEK_LAST_QUATER': 'EVERY WEEK LAST QUATER',
          'ONE_WEEK_LAST_YEAR': 'EVERY WEEK LAST YEAR',
          'ONE_MONTH_LAST_YEAR': 'EVERY MONTH LAST YEAR',
          'ONE_MONTHE_SINCE_START': 'EVERY MONTH',
          'ANY': 'ANY',
          'UNKNOWN': 'UNKNOWN',
          'payload': 'Payload',
          'IN': 'IN',
          'OUT': 'OUT',
          'common': {
            'ip': 'IP',
            'mac': 'MAC',
            'os': 'OS',
            'make': 'Make',
            'status': 'Status',
            'na': 'N.A.',
            'total': 'Total',
            'eventTotal': 'Total Events',
            'assetTotal': 'Total Assets',
            'loading': 'Data Loading ...',
            'srcIp': 'Source IP',
            'srcPort': 'Source Port',
            'dstIp': 'Destination IP',
            'dstPort': 'Destination Port',
            'protocolL4': 'L4 Protocol',
            'protocolL7': 'L7 Protocol',
            'rule': 'Rule',
            'negate': 'Negate',
            'must': 'Must',
            'mustnot': 'Must Not',
            'noData': 'No Data',
            'severity': 'Level',
            'LOW': 'LOW',
            'MEDIUM': 'MEDIUM',
            'HIGH': 'HIGH',
            'showMonitor': 'Show Minitor',
            'turnOnMonitor': 'Turn On Monitor',
            'monitorFlow': 'Monitor Flow',
            'monitorTraffic': 'Monitor Traffic',
            'controlDeviceRules': 'Key Operation Rules',
            'content': 'Content',
            'agent': 'Agent',
            'details': 'Details',
            'template': 'Template',
            'direction': 'Direction',
            'port': 'Port',
            'flowRule': 'Flow Policies',
            'flowTotal': 'Total Flows (bytes)',
            'flowAvgTotal': 'Avg/Total Flows（bytes）',
              'flowInAvgTotal': 'Avg/Total In Flows（bytes）',
              'flowOutAvgTotal': 'Avg/Total Out Flows（bytes）',

              'avgFlowIn': 'Avg In Flows (bytes)',
              'avgFlowOut': 'Avg Out Flows (bytes)',
              'minFlowIn': 'Min In Flows (bytes)',
              'maxFlowIn': 'Max In Flows (bytes)',
              'minFlowOut': 'Min Out Flows (bytes)',
              'maxFlowOut': 'Max Out Flows (bytes)',


            'alertSpikeOn': 'Continuous Spike Alert',
            'turnOnAlertSpike': 'Turn On Continuous Spike Alert',
            'alertSpikeFrameworkNumber': 'Timeframe Number',
            'alertSpikeFrameworkUnit': 'Timeframe Unit',
            'alertSpikeHeight': 'Spike Height',
            'alertSpikeOnDisplay': 'Continuous Spike Alert On',
            'alertSpikeOffDisplay': 'Continuous Spike Alert Off',

            'cronAlertSpikeOn': 'Fixed-date Spike Alert',
            'turnOnCronAlertSpike': 'Turn On Fixed-date Spike Alert',
            'cronAlertSpikeFrameworkNumber': 'Timeframe Number',
            'cronAlertSpikeFrameworkUnit': 'Timeframe Unit',
            'cronAlertSpikeFrameworkSamplingCount': 'Sampling Timeframe Count',
            'cronAlertSpikeFrameworkInterval': 'Check Interval',
            'cronAlertSpikeHeight': 'Spike Height',
            'cronAlertSpikeOnDisplay': 'Fixed-date Spike Alert On',
            'cronAlertSpikeOffDisplay': 'Fixed-date Spike Alert Off',

            'flowTotalIn': 'Total In Flows（bytes）',
            'flowTotalOut': 'Total Out Flows（bytes）',
            'monitor': 'Monitor',
            'flowTotalInByL4': 'Total In Flows（bytes）by L4 Protocols',
            'flowTotalInByL7': 'Total In Flows（bytes）by L7 Protocols',
            'flowTotalInBySrcIp': 'Total In Flows（bytes）by Source IP',
            'flowTotalInByDstIp': 'Total In Flows（bytes）by Destination IP',
            'flowTotalOutByL4': 'Total Out Flows（bytes）by L4 Protocols',
            'flowTotalOutByL7': 'Total Out Flows（bytes）by L7 Protocols',
            'flowTotalOutBySrcIp': 'Total Out Flows（bytes）by Source IP',
            'flowTotalOutByDstIp': 'Total Out Flows（bytes）by Destination IP',
            'flowTotalByL7': 'Total Flows (bytes) by L7 Protocols',
            'flowTotalByL4': 'Total Flows (bytes) by L4 Protocols',
            'firewallRuleEventsByRule': 'Total Events by Rules',
            'firewallRuleEventsBySeverity': 'Total Events by Severity',
            'keyOpEventsByRule': 'Key Operations by Rule',
            'keyOpEventsBySeverity': 'Key Operations by Severity',
            'flowTotalByDstPort': 'Total Flows (bytes) by DestinationPort',
            'avg': 'Average',
            'movingMeanAvg': 'Moving Mean Average',
            'movingMeanAvgUpperBound': 'Moving Mean Average Upper Bound',
            'allRule': 'All Rules',
            'allSeverity': 'All Severities',
            'showing': 'Showing',
            'all': 'All',
            'record': 'Record',
            'detectedTimestamp': 'Detected Timestamp',
              'advancedSearch': 'Advanced Search',
              'latestEvents': 'Latest Events',
              'unknownIp': 'Unknown IP',
              'unknownPort': 'Unknown Port',
              'searchAllEvents': 'Search All',
              'noLatestEvents': 'No Latest Events',
              'statusEdit': 'Status(double-click to edit)',
              'onlyThisRule': 'Only Show This Rule',
              'nodeName': 'Name(double-click to edit)',
              'name': 'Name',
              'latitude': 'Latitude',
              'longitude': 'Longitude',
              'x': 'X Coordinate',
              'y': 'Y Coordinate',
              'clickMapToSee': 'Please select',
              'totalProbes': 'Total Probes',
              'totalEvents': 'Total Events',
              'image': 'Background Image',
              'allProbes': 'All Probes',
              'flowIn': 'Flow In',
              'flowOut': 'Flow Out'
          },
          'assets': {
            'assets': 'Assets',
            'assetsByStatus': 'Assets by Status',
            'alerts': 'Alerts',
            'multipleMac': 'Assets with Multiple MACs',
            'multipleOs': 'Assets with Multiple OSs',
            'new': 'New Assets',
            'NEW': 'NEW',
            'VALID': 'VALID',
            'INVALID': 'INVALID',
            'IGNORED': 'IGNORED',
            'showIgnored': 'Show Ignored',
            'loading': 'Discovering ...'
          },
          'behaviour': {
            'firewallRule': 'Traffic and Flow Rules'
          },
          'rule': {
            'ACTIVE': 'Active',
            'INACTIVE': 'Inactive',
            'alertTrue': 'True',
            'alertFalse': 'False',
            'enable': 'Enable',
            'disable': 'Disable'
          },

          'login': {
            'login': 'Login',
            'username': 'Username',
            'password': 'Password',
            'pleaseLogin': 'Please Login',
            'loginFail': 'Login Failed'
          },

          'label': {
            'confirm': 'Confirm',
            'cancel': 'Cancel',
            'add': 'Add',
            'delete': 'Delete',
            'edit': 'Edit',
            'save': 'Save',
            'new': 'New',
            'start': 'Start',
            'end': 'End',
            'search': 'Search',
            'date': 'Date',
            'close': '关闭'
          },

          'navigation': {
            'header': 'Erlangshen',
            'dashboard': 'Dashboard',
            'assets': 'Assets',
            'flows': 'Flows',
            'behaviours': 'Behaviours',
            'controlDevices': 'Control Devices',
            'pageAdmin': 'Admin',
            'userSetting': 'User Setting',
            'logout': 'Logout',
            'createUser': 'Create User',
            'userProfile': 'User Profile',
            'userManagement': 'User Management',
            'monitor': 'Event',
            'flow': 'Flow',
            'traffic': 'Traffic',
            'summary': 'Summary',
            'flowRules': 'Flows Policies',
              'probeAdmin': 'Probes'
          },

          'user': {
            'username': 'Username',
            'usernamePrompt': 'Please enter the username',
            'passwordPrompt': 'Please enter the password',
            'confirmPassword': 'Confirm password',
            'role': 'Role',
            'admin': 'Admin',
            'user': 'User',
            'name': 'Name',
            'newPassword': 'New password ( only if reset )',
            'confirmNewPassword': 'Confirm new password'
          },
          'validation': {
            'WARN_IP_CIDR_OR_ANY': 'Please enter a valid IP address, or CIDR notation, or *',
            'WARN_VALID_IP': 'Please enter a valid IP address',
            'WARN_PORT_RANGE_ANY': 'Please enter a single valid port number, or port number range in the form of low-high, or *',
            'WARN_REQUIRED': 'Required',
            'WARN_VALID_INTEGER': 'Please enter an integer greater than zero',
            'CREATE_USER_SUCCESS': 'New user created successfully',
            'CREATE_USER_FAIL': 'Failed to create new user, please try again later',
            'CHANGE_PASSWORD_SUCCESS': 'Password reset successfully',
            'CHANGE_PASSWORD_FAIL': 'Failed to reset password, please try again later',
            'UPDATE_USER_SUCCESS': 'User profile updated successfully',
            'UPDATE_USER_FAIL': 'Failed to update user profile, please try again later',
            'UPDATE_USERS_SUCCESS': 'User profiles updated successfully',
            'UPDATE_USERS_FAIL': 'Failed to update user profiles, please try again later',
            'USERNAME_EXISTS': 'Username is taken',
            'PASSWORD_INVALID': 'Password is at minimum 8-digit, only including numbers or characters, with at least 1 number and at least 1 character',
            'PASSWORD_NOTMATCH': 'Passwords do not match',
            'USERNAME_INVALID': 'Username must be a valid email address',
            'USERNAME_DUPLICATE': 'Username is taken',
            'FIELD_REQUIRED': 'Both username and password are required',
              'LONGITUDE_INVALID': 'Invalid Longitude',
              'LATITUDE_INVALID': 'Invalid Latitude',
              'PERCENTAGE_INVALID': 'Please enter a nubmer between 0 and 1'

          },
          'dashboard': {
            'topology': 'Topology',
            'totalControlDevice': 'Total Number of Control Devices',
            'totalCriticalOperation': 'Total Number of Critical Operations',
            'mostFlowSource': 'Source IP with Top Flow',
            'mostFlowDestination': 'Destination IP with Top Flow',
            'mostFlowPair': 'Source IP/MAC with Top Flow',
            'leastFlowSource': 'Source IP with Least Flow',
            'leastFlowDestination': 'Destination IP with Least Flow',
            'leastFlowPair': 'Source IP/MAC with Least Flow',
            'last5min': 'Last 5 minutes',
            'last10min': 'Last 10 minutes',
            'last30min': 'Last 30 minutes',
            'last1hour': 'Last hour',
            'last12hour': 'Last 12 hours',
            'last24hour': 'Last 24 hours',
            'last3day': 'Last 3 days',
            'last7day': 'Last week',
            'last14day': 'Last 2 weeks',
            'last1month': 'Last month',
            'last3month': 'Last 3 months',
            'last6month': 'Last 6 months',
            'last9month': 'Last 9 months',
            'last1year': 'Last year',
            'totalAssets': 'Total Assets',
            'totalAssetsAlerts': 'Total Assets Alerts',
            'totalNewAssets': 'Total New Assets',
            'totalValidAssets': 'Total Valid Assets',
            'totalInvalidAssets': 'Total Invalid Assets',
            'totalIgnoredAssets': 'Total Ignored Assets',
            'totalFirewallRuleEvents': 'Total Traffic Events',
            'totalFirewallRuleEventsHigh': 'Total Traffic Events - High Severity',
            'totalFirewallRuleEventsMedium': 'Total Traffic Events - Medium Severity',
            'totalFirewallRuleEventsLow': 'Total Traffic Events - Low Severity',
            'totalRuleEvents': 'Total Key Operation Events',
            'totalRuleEventsHigh': 'Total Key Operation Events - High Severity',
            'totalRuleEventsMedium': 'Total Key Operation Events - Medium Severity',
            'totalRuleEventsLow': 'Total Key Operation Events - Low Severity'
          }
        }
      );

      $translateProvider.translations('zh',
        {
            "*": "任意",
          "@timestamp": "时间",
          "IN_SRC_MAC": "源MAC",
          "OUT_DST_MAC": "目标MAC",
          "IN_SRC_OS": "源操作系统",
          "OUT_DST_OS": "目标操作系统",
          "IPV4_SRC_ADDR": "源IP",
          "IPV4_DST_ADDR": "目标IP",
          "L4_SRC_PORT": '源端口',
          "L4_DST_PORT": '目标端口',
          "PROTOCOL": 'L4协议',
          "L7_PROTO": 'L7协议',
          "L7_PROTO_NAME": "L7协议名",
          "TCP_FLAGS": 'TCP FLAGS',
          "IN_PKTS": '流入包数',
          "IN_BYTES": '流入BYTES',
          "OUT_PKTS": '流出包数',
          "OUT_BYTES": '流出BYTES',
          "HTTP_HOST": "HTTP HOST",
          "HTTP_URL": "HTTP URL",
          "HTTP_METHOD": "HTTP METHOD",
          "HTTP_RET_CODE": 'HTTP返回值',
          "payload": "有效载荷",

            'SECOND': '秒',
          'MINUTE': '分钟',
          'HOUR': '小时',
          'DAY': '天',
          'WEEK': '周',
          'MONTH': '月',
          'QUATER': '季度',
          'YEAR': '年',

          'LAST_MINUTE': '过去1分钟',
            'LAST_TEN_MINUTE' : '过去10分钟',
          'LAST_HOUR': '过去1小时',
          'LAST_DAY': '过去1天',
          'LAST_WEEK': '过去1周',
          'LAST_MONTH': '过去1月',
          'LAST_QUATER': '过去1季度',
          'LAST_YEAR': '过去1年',

          'ONE_SECOND_LAST_MINUTE': '过去1分钟，每秒',
            'ONE_MINUTE_LAST_TEN_MINUTE': '过去10分钟，每分钟',
          'ONE_MINUTE_LAST_HOUR': '过去1小时，每分钟',
          'ONE_HOUR_LAST_DAY': '过去1天，每小时',
          'ONE_HOUR_LAST_WEEK': '过去1周，每小时',
          'ONE_DAY_LAST_WEEK': '过去1周，每天',
          'ONE_DAY_LAST_MONTH': '过去1月，每天',
          'ONE_DAY_LAST_QUATER': '过去1季度，每天',
          'ONE_WEEK_LAST_QUATER': '过去1季度，每周',
          'ONE_WEEK_LAST_YEAR': '过去1年，每周',
          'ONE_MONTH_LAST_YEAR': '过去1年，每月',
          'ONE_MONTHE_SINCE_START': '每月',
          'ANY': '任意',
          'UNKNOWN': '未知',
          'IN': '进',
          'OUT': '出',
          'common': {
            'ip': 'IP',
            'mac': 'MAC',
            'os': '操作系统',
            'make': '品牌',
            'status': '状态',
            'na': '无',
            'total': '总计',
            'eventTotal': '事件总计',
            'assetTotal': '资产总计',
            'loading': '加载数据，请稍候......',
            'srcIp': '源IP',
            'srcPort': '源端口',
            'dstIp': '目标IP',
            'dstPort': '目标端口',
            'protocolL4': 'L4协议',
            'protocolL7': 'L7协议',
            'rule': '规则',
            'negate': '不是',
            'must': '是',
            'mustnot': '不是',
            'severity': '级别',
            'noData': '无数据',
            'LOW': '低危',
            'MEDIUM': '中危',
            'HIGH': '高危',
            'showMonitor': '是否监测',
            'turnOnMonitor': '开启监测',
            'monitorFlow': '开启流量监测',
            'monitorTraffic': '开启访问监测',
            'controlDeviceRules': '关键操作规则',
            'content': '内容',
            'agent': '采集器',
            'details': '查看',
            'template': '模版',
            'direction': '方向',
            'port': '端口',
            'flowRule': '流量规则',
            'flowTotal': '流量总计（bytes）',
            'flowAvgTotal': '平均流量（bytes）／总流量（bytes）',
              'flowInAvgTotal': '流入平均流量（bytes）／总流量（bytes）',
              'flowOutAvgTotal': '流出平均流量（bytes）／总流量（bytes）',


              'avgFlowIn': '流入平均流量 (bytes)',
              'avgFlowOut': '流出平均流量 (bytes)',
              'minFlowIn': '流入最低流量 (bytes)',
              'maxFlowIn': '流入最高流量 (bytes)',
              'minFlowOut': '流出最低流量 (bytes)',
              'maxFlowOut': '流出最高流量 (bytes)',


            'alertSpikeOn': '连续峰值报警',
            'turnOnAlertSpike': '开启连续峰值报警',
            'alertSpikeFrameworkNumber': '窗口数值',
            'alertSpikeFrameworkUnit': '窗口单位',
            'alertSpikeHeight': '峰值高度',
            'alertSpikeOnDisplay': '连续峰值报警已开启',
            'alertSpikeOffDisplay': '连续峰值报警已关闭',

            'cronAlertSpikeOn': '固定时间峰值报警',
            'turnOnCronAlertSpike': '开启固定时间峰值报警',
            'cronAlertSpikeFrameworkNumber': '窗口数值',
            'cronAlertSpikeFrameworkUnit': '窗口单位',
            'cronAlertSpikeFrameworkSamplingCount': '窗口取样个数',
            'cronAlertSpikeFrameworkInterval': '固定时间间隔',
            'cronAlertSpikeHeight': '峰值高度',
            'cronAlertSpikeOnDisplay': '固定时间峰值报警已开启',
            'cronAlertSpikeOffDisplay': '固定时间峰值报警已关闭',

            'flowTotalIn': '流入流量总计（bytes）',
            'flowTotalOut': '流出流量总计（bytes）',
            'monitor': '实时监测',
            'flowTotalInByL4': '流入流量总计（bytes）: 按L4 协议细分',
            'flowTotalInByL7': '流入流量总计（bytes）: 按L7 协议细分',
            'flowTotalInBySrcIp': '流入流量总计（bytes）: 按源IP细分',
            'flowTotalInByDstIp': '流入流量总计（bytes）: 按目标IP细分',
            'flowTotalOutByL4': '流出流量总计（bytes）: 按L4 协议细分',
            'flowTotalOutByL7': '流出流量总计（bytes）: 按L7 协议细分',
            'flowTotalOutBySrcIp': '流出流量总计（bytes）: 按源IP细分',
            'flowTotalOutByDstIp': '流出流量总计（bytes）: 按目标IP细分',
            'flowTotalByL7': '流量总计（bytes）: 按L7 协议细分',
            'flowTotalByL4': '流量总计（bytes）: 按L4 协议细分',
            'firewallRuleEventsByRule': '事件总计：按规则细分',
            'firewallRuleEventsBySeverity': '事件总计：按严重级别细分',
            'keyOpEventsByRule': '关键操作：按规则细分',
            'keyOpEventsBySeverity': '关键操作：按规则细分',
            'flowTotalByDstPort': '流量总计（bytes）: 按目标端口细分',
            'avg': '平均流量',
            'movingMeanAvg': '移动平均流量',
            'movingMeanAvgUpperBound': '报警上限',
            'allRule': '所有规则',
            'allSeverity': '所有严重级别',
            'showing': '目前显示',
            'all': '所有',
            'record': '事件记录',
            'detectedTimestamp': '发现时间',
              'advancedSearch': '高级搜索',
              'latestEvents': '最近事件',
              'unknownIp': '未知IP',
              'unknownPort': '未知端口',
              'searchAllEvents': '搜索所有事件',
              'noLatestEvents': '没有最近事件',
              'statusEdit': '状态（双击编辑）',
              'onlyThisRule': '只显示此规则',
              'nodeName': '资产名称（双击编辑）',
              'name': '名称',
              'latitude': '纬度',
              'longitude': '经度',
              'x': 'X 坐标',
              'y': 'Y 坐标',
              'xClickToEdit': 'X坐标（双击编辑）',
              'yClickToEdit': 'Y坐标（双击编辑）',
              'clickMapToSee': '未选',
              'totalProbes': '采集器总计',
              'totalEvents': '事件总计',
              'image': '背景图片',
              'allProbes': '所有采集器',
              'flowIn': '流入流量',
              'flowOut': '流出流量'
          },
          'assets': {
            'assets': '所有资产',
            'assetsByStatus': '资产总计：资产状态',
            'alerts': '可疑资产',
            'multipleMac': '可疑MAC',
            'multipleOs': '可疑操作系统',
            'new': '新资产',
            'NEW': '新发现',
            'VALID': '可信',
            'INVALID': '不可信',
            'IGNORED': '可忽略',
            'showIgnored': '显示"可忽略"资产',
            'loading': '正在发现资产，请稍候......'
          },
          'behaviour': {
            'firewallRule': '访问行为规则'
          },
          'rule': {
            'ACTIVE': '已激活',
            'INACTIVE': '禁用',
            'alertTrue': '触发',
            'alertFalse': '不触发',
            'enable': '激活',
            'disable': '禁用'
          },

          'login': {
            'login': '登录',
            'username': '用户名',
            'password': '密码',
            'pleaseLogin': '请登录',
            'loginFail': '登录失败'
          },

          'label': {
            'confirm': '确认',
            'cancel': '取消',
            'add': '添加',
            'delete': '删除',
            'edit': '编辑',
            'save': '保存',
            'new': '新',
            'start': '开始时间',
            'end': '结束时间',
            'search': '搜索',
            'date': '日期',
            'close': '关闭'
          },

          'navigation': {
            'header': 'xAlert 工控全网监测预警平台',
            'dashboard': '仪表盘',
            'assets': '网络资产',
            'flows': '流量监测',
            'behaviours': '网络行为',
            'controlDevices': '关键操作',
            'pageAdmin': '系统配置',
            'userSetting': '用户设置',
            'logout': '注销',
            'createUser': '创建用户',
            'userProfile': '用户资料',
            'userManagement': '用户管理',
            'monitor': '事件监测',
            'flow': '流量监测',
            'traffic': '事件监测',
            'summary': '概览',
            'flowRules': '流量规则',
              'probeAdmin': '采集器配置'
          },

          'user': {
            'username': '用户名',
            'password': '密码',
            'usernamePrompt': '请输入用户名',
            'passwordPrompt': '请输入密码',
            'confirmPassword': '请再输入密码一次',
            'role': '权限',
            'admin': '管理员',
            'user': '用户',
            'name': '姓名',
            'newPassword': '若需重置密码,请输入新密码',
            'confirmNewPassword': '请再输入新密码一次'
          },
          'validation': {
            'WARN_IP_CIDR_OR_ANY': '请输入有效IP地址或星号',
            'WARN_REQUIRED': '必须填写',
            'WARN_PORT_RANGE_ANY': '请填写1到65535之间的单一端口号，或端口号范围（低-高），或星号',
            'WARN_VALID_INTEGER': '请输入大于零的整数',
            'CREATE_USER_SUCCESS': 'New user created successfully',
            'CREATE_USER_FAIL': 'Failed to create new user, please try again later',
            'CHANGE_PASSWORD_SUCCESS': 'Password reset successfully',
            'CHANGE_PASSWORD_FAIL': 'Failed to reset password, please try again later',
            'UPDATE_USER_SUCCESS': 'User profile updated successfully',
            'UPDATE_USER_FAIL': 'Failed to update user profile, please try again later',
            'UPDATE_USERS_SUCCESS': 'User profiles updated successfully',
            'UPDATE_USERS_FAIL': 'Failed to update user profiles, please try again later',
            'USERNAME_EXISTS': 'Username is taken',
            'PASSWORD_INVALID': 'Password is at minimum 8-digit, only including numbers or characters, with at least 1 number and at least 1 character',
            'PASSWORD_NOTMATCH': 'Passwords do not match',
            'USERNAME_INVALID': 'Username must be a valid email address',
            'USERNAME_DUPLICATE': 'Username is taken',
            'FIELD_REQUIRED': 'Both username and password are required',
              'LONGITUDE_INVALID': '经度格式错误',
              'LATITUDE_INVALID': '纬度格式错误',
              'PERCENTAGE_INVALID': '请输入0到1之间的数字'
          },
          'dashboard': {
            'topology': '拓扑图',
            'totalControlDevice': '工控设备总计',
            'totalCriticalOperation': '关键操作总计',
            'mostFlowSource': '通信最多的源地址',
            'mostFlowDestination': '通信最多的目标地址',
            'mostFlowPair': '通信最多的源/目标地址',
            'leastFlowSource': '通信最少的源地址',
            'leastFlowDestination': '通信最少的目标地址',
            'leastFlowPair': '通信最少的源/目标地址',
            'last5min': '过去5分钟',
            'last10min': '过去10分钟',
            'last30min': '过去30分钟',
            'last1hour': '过去1小时',
            'last12hour': '过去12小时',
            'last24hour': '过去24小时',
            'last3day': '过去3天',
            'last7day': '过去1周',
            'last14day': '过去2周',
            'last1month': '过去1个月',
            'last3month': '过去3个月',
            'last6month': '过去6个月',
            'last9month': '过去9个月',
            'last1year': '过去1年',
            'totalAssets': '资产总计',
            'totalAssetsAlerts': '资产报警总计',
            'totalNewAssets': '新资产总计',
            'totalValidAssets': '可信资产总计',
            'totalInvalidAssets': '可疑资产总计',
            'totalIgnoredAssets': '可忽略资产总计',
            'totalFirewallRuleEvents': '通信访问事件',
            'totalFirewallRuleEventsHigh': '通信访问事件 - 高危',
            'totalFirewallRuleEventsMedium': '通信访问事件 - 中危',
            'totalFirewallRuleEventsLow': '通信访问事件 - 低危',
            'totalRuleEvents': '关键操作事件',
            'totalRuleEventsHigh': '关键操作事件 - 高危',
            'totalRuleEventsMedium': '关键操作事件 - 中危',
            'totalRuleEventsLow': '关键操作事件 - 低危'
          }
        }
      );

      $translateProvider.preferredLanguage('zh');
      $translateProvider.useSanitizeValueStrategy('escapeParameters');
        $qProvider.errorOnUnhandledRejections(false);

    }])

  .run(function ($rootScope, $location, auth) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
      auth.isLoggedInAsync(function (loggedIn) {
        if (toState.authenticate && !loggedIn) {
          $rootScope.returnToState = toState.url;
          //$rootScope.returnToStateParams = toParams.Id;
          $location.path('/login');
          if (!$rootScope.$$phase) $rootScope.$apply()
        }
      });
    });
    moment.locale('zh-cn');
  });
