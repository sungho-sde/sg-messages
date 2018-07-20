import '../../lib/angular-object-table/build/object-table-style.css';
import '../../lib/angular-object-table/build/object-table';

import './assets/stylesheets/index.scss';


import config from './config/app.main.config';
import routing from './config/app.main.route';

import MainCtrl from './controllers/app.main.controller';
import RedirectCtrl from './controllers/app.main.redirect.controller';
import HeaderCtrl from './controllers/app.main.header.controller';
import NavCtrl from './controllers/app.main.nav.controller';
import MessageMgmtCtrl from './controllers/message/app.main.message-mgmt.controller';
import MessageCreateModalCtrl from './controllers/modal/app.main.message-create-modal.controller';
import UserMgmtCtrl from './controllers/user/app.main.user-mgmt.controller';
import UserCreateModalCtrl from './controllers/modal/app.main.user-create-modal.controller';
import UserUploadModalCtrl from './controllers/modal/app.main.user-upload-modal.controller';
import SenderMgmtCtrl from './controllers/sender/app.main.sender-mgmt.controller';
import SenderWriteModalCtrl from './controllers/modal/app.main.sender-write-modal.controller';
import SenderTemplateModalCtrl from './controllers/modal/app.main.sender-template-modal.controller';
import SenderDetailModalCtrl from './controllers/modal/app.main.sender-detail-modal.controller';




import navigator from './services/app.main.navigator';

import tableHeader from './filters/app.main.table-header.filter';

import sgSideNav from './directives/sg-side-nav/app.crm.sg-side-nav';
import sgEmptyContent from './directives/sg-empty-content/app.main.sg-empty-content';
import sgModalHeader from './directives/sg-modal-header/app.main.sg-modal-header';
import sgPageNumber from './directives/sg-page-number/app.main.sg-page-number';

import templateManager from './services/managers/app.main.template.manager';
import statusHandler from './services/app.main.status.handler';
import modalHandler from './services/app.main.modal.handler';

import Templates from './services/models/app.main.templates.model';

import sideNavItems from './services/constants/app.main.side-nav.constant';
import sideNavParentItems from './services/constants/app.main.side-nav-parent.constant'
import queryStringItems from './services/constants/app.main.query-string.constant';

import appResources from './services/app.main.constant';

const APP_NAME = "app.main";

angular.module(APP_NAME, ['app.main-core', 'app.main.template', 'objectTable'])
    .config(config)

    .constant("sideNavItems", sideNavItems)
    .constant("sideNavParentItems", sideNavParentItems)
    .constant("queryStringItems", queryStringItems)
    .constant("appResources", appResources)

    .config(routing)

    .controller("MainCtrl", MainCtrl)
    .controller("HeaderCtrl", HeaderCtrl)
    .controller("NavCtrl", NavCtrl)
    .controller("RedirectCtrl", RedirectCtrl)
    .controller("MessageMgmtCtrl", MessageMgmtCtrl)
    .controller("MessageCreateModalCtrl", MessageCreateModalCtrl)
    .controller("UserMgmtCtrl",UserMgmtCtrl)
    .controller("UserCreateModalCtrl", UserCreateModalCtrl)
    .controller("UserUploadModalCtrl", UserUploadModalCtrl)
    .controller("SenderMgmtCtrl",SenderMgmtCtrl)
    .controller("SenderWriteModalCtrl",SenderWriteModalCtrl)
    .controller("SenderTemplateModalCtrl",SenderTemplateModalCtrl)
    .controller("SenderDetailModalCtrl",SenderDetailModalCtrl)

    .service("navigator", navigator)
    .service("statusHandler", statusHandler)
    .service("templateManager", templateManager)
    .service("modalHandler", modalHandler)

    .factory("Templates", Templates)

    .directive("sgSideNav", sgSideNav)
    .directive("sgEmptyContent", sgEmptyContent)
    .directive("sgModalHeader", sgModalHeader)
    .directive("sgPageNumber", sgPageNumber)



    .filter("tableHeader", tableHeader);

if (window.location.hash === '#_=_') window.location.hash = '/';

angular.element(document).ready(function () {
    angular.bootstrap(document, [APP_NAME]);
});

export default APP_NAME;