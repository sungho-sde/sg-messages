import '../../../../core/client/modules/common/base/alert-dialog/assets/stylesheets/alert-dialog.scss';
import '../../../../core/client/modules/common/base/loading-handler/assets/stylesheets/core.loading-handler.scss';

import coreBaseModule from '../../../../core/client/modules/common/base/core.base.module';
import sessionModule from '../../../../core/client/modules/common/session/core.session.module';


import 'angularjs-datepicker/dist/angular-datepicker.min.css';
import 'angularjs-datepicker';
import uiBootstrap from 'angular-ui-bootstrap';
import 'angular-file-upload';

export default angular.module("app.main-core", [
    coreBaseModule,
    sessionModule,
    uiBootstrap,
    'angularFileUpload',
    '720kb.datepicker'
]).name;