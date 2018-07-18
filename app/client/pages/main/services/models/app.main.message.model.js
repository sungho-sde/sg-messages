Messages.$inject = ['$resource', 'appResources'];

export default function Messages($resource, appResources) {
    "ngInject";

    return $resource(appResources.MESSAGES + '/:id', {
        id: '@id'
    }, {
        update: {
            method: 'PUT'
        },
        query: {
            isArray: false
        }
    })
}