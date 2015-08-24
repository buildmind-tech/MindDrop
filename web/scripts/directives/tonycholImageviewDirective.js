angular.module('tonychol.imageviewDirective', ['ngFileUpload'])
    .factory('dropFilesService', [function() {
        var dropInstance = [{
            suffix: 'png',
            size: '500',
            name: "Assignment",
            url: "drop/images/Image 1.png",
            views: 113,
        }, {
            suffix: 'png',
            size: '5230',
            name: "Homework",
            url: "drop/images/Image 2.png",
            views: 113,
        }, {
            suffix: 'pdf',
            size: '11',
            name: "Assignment",
            url: "drop/pdf/pdf.pdf",
            views: 1156,
        }, {
            suffix: 'ppt',
            size: '200',
            name: "Assignment",
            url: "drop/ppt/ppt.ppt",
            views: 1182,
        }, {
            suffix: 'zip',
            size: '1000',
            name: "Assignment",
            url: "drop/zip/zip.zip",
            views: 912,
        }];

        return {
            dropFiles: dropInstance,
        };
    }])
    .directive('dropFile', function() {
        dropFileTplStr = "";
        var directive = {};
        directive.restrict = 'E';
        directive.replace = true;
        directive.scope = {
            /* -----------
		| file's property
		| 	- suffix
		| 	- size
		| 	- name
		| 	- url
    		------------*/
            file: "=file",
        };
        // directive.template = "Name: {{customer.name}}, Live in: {{customer.address}}";
        directive.templateUrl = 'views/drop-image.html';
        directive.link = function(scope, element, attrs) {
            scope.fileThumbnail = function(file) {
                if (file.suffix === 'zip') {
                    return 'drop/zip/zip.png';
                } else if (file.suffix === 'png') {
                    return file.url;
                } else if (file.suffix === 'pdf') {
                    return 'drop/pdf/pdf.png';
                } else if (file.suffix === 'ppt') {
                	return 'drop/ppt/ppt.png';
                }
            };
        };
        return directive;
    })
    .controller('TonyCholDropFileCtrl', ['$scope', '$mdSidenav', 'dropFilesService','Upload', '$timeout', function($scope, $mdSidenav, dropFilesService, Upload, $timeout) {
        $scope.toggleSidenav = function(menuId) {
            $mdSidenav(menuId).toggle();
        };
        $scope.customer = {
            name: 'Naomi',
            address: '1600 Amphitheatre',
        };
        $scope.dropFiles = dropFilesService.dropFiles;
        $scope.$watch('files', function() {
            $scope.upload($scope.files);
        });
        $scope.$watch('file', function() {
            $scope.upload([$scope.file]);
        });
        $scope.log = '';
        // $scope.upload = function(files) {
        //     if (files && files.length) {
        //         for (var i = 0; i < files.length; i++) {
        //             var file = files[i];
        //             Upload.upload({
        //                 url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
        //                 fields: {
        //                     'username': $scope.username
        //                 },
        //                 file: file
        //             }).progress(function(evt) {
        //                 var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        //                 $scope.log = 'progress: ' + progressPercentage + '% ' +
        //                     evt.config.file.name + '\n' + $scope.log;
        //             }).success(function(data, status, headers, config) {
        //                 $timeout(function() {
        //                     $scope.log = 'file: ' + config.file.name + ', Response: ' + JSON.stringify(data) + '\n' + $scope.log;
        //                 });
        //             });
        //         }
        //     }
        // };



    }]);