Templates.$inject = ['$resource', 'appResources'];

export default function Templates($resource, appResources) {
    "ngInject";

    return $resource(appResources.TEMPLATES + '/:id', {
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