/**
 * DO NOT REFERENCE THE .ts FILE DIRECTLY
 * To consume this
 * 1. reference the generated .d.ts file in ../../../../TypeDefinitions/Playbook/Localization/ResourceStringProvider.d.ts.
 * 2. add Playbook/Localization/ResourceStringProvider.js as a web resource dependency on the js file that is consuming this.
 */
var PlaybookService;
(function (PlaybookService) {
    var ResourceStringProvider = (function () {
        function ResourceStringProvider() {
        }
        ResourceStringProvider.getResourceString = function (key) {
            var value = Xrm.Utility.getResourceString(ResourceStringProvider.WebResourceName, key);
            if (value === undefined || value === null) {
                value = key;
            }
            return value;
        };
        return ResourceStringProvider;
    }());
    ResourceStringProvider.WebResourceName = "Playbook/Localization/Languages/msdyn_Playbook";
    PlaybookService.ResourceStringProvider = ResourceStringProvider;
})(PlaybookService || (PlaybookService = {}));
//# sourceMappingURL=msdyn_ResourceStringProvider.js.map