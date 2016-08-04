var fluid_2_0_0=fluid_2_0_0||{};!function($,fluid){"use strict";fluid.registerNamespace("fluid.prefs"),fluid.defaults("fluid.prefs.auxSchema",{gradeNames:["fluid.component"],auxiliarySchema:{loaderGrades:["fluid.prefs.separatedPanel"]}}),fluid.prefs.expandSchemaValue=function(root,pathRef){return"@"!==pathRef.charAt(0)?pathRef:fluid.get(root,pathRef.substring(1))},fluid.prefs.addAtPath=function(root,path,object){var existingObject=fluid.get(root,path);return fluid.set(root,path,$.extend(!0,{},existingObject,object)),root},fluid.prefs.removeKey=function(root,key){var value=root[key];return delete root[key],value},fluid.prefs.rearrangeDirect=function(root,toPath,sourcePath){var result={},sourceValue=fluid.prefs.removeKey(root,sourcePath);return sourceValue&&fluid.set(result,toPath,sourceValue),result},fluid.prefs.addCommonOptions=function(root,path,commonOptions,templateValues){templateValues=templateValues||{};var existingValue=fluid.get(root,path);if(!existingValue)return root;var opts={},mergePolicy={};return fluid.each(commonOptions,function(value,key){if("container"===key){var componentType=fluid.get(root,[path,"type"]),componentOptions=fluid.defaults(componentType);if(void 0===fluid.get(componentOptions,["argumentMap","container"]))return!1}key.indexOf("gradeNames")!==-1&&(mergePolicy[key]=fluid.arrayConcatPolicy),key=fluid.stringTemplate(key,templateValues),value="string"==typeof value?fluid.stringTemplate(value,templateValues):value,fluid.set(opts,key,value)}),fluid.set(root,path,fluid.merge(mergePolicy,existingValue,opts)),root},fluid.prefs.containerNeeded=function(root,path){var componentType=fluid.get(root,[path,"type"]),componentOptions=fluid.defaults(componentType);return fluid.hasGrade(componentOptions,"fluid.viewComponent")||fluid.hasGrade(componentOptions,"fluid.rendererComponent")},fluid.prefs.checkPrimarySchema=function(primarySchema,prefKey){return primarySchema||fluid.fail("The primary schema for "+prefKey+" is not defined."),!!primarySchema},fluid.prefs.expandSchemaComponents=function(auxSchema,type,prefKey,componentConfig,index,commonOptions,modelCommonOptions,mappedDefaults){var componentOptions=fluid.copy(componentConfig)||{},components={},initialModel={},componentName=fluid.prefs.removeKey(componentOptions,"type"),regexp=new RegExp("\\.","g"),memberName=componentName.replace(regexp,"_"),flattenedPrefKey=prefKey.replace(regexp,"_");if(componentName){components[memberName]={type:componentName,options:componentOptions};var selectors=fluid.prefs.rearrangeDirect(componentOptions,memberName,"container"),templates=fluid.prefs.rearrangeDirect(componentOptions,memberName,"template"),messages=fluid.prefs.rearrangeDirect(componentOptions,memberName,"message"),preferenceMap=fluid.defaults(componentName).preferenceMap,map=preferenceMap[prefKey],prefSchema=mappedDefaults[prefKey];fluid.each(map,function(primaryPath,internalPath){if(fluid.prefs.checkPrimarySchema(prefSchema,prefKey)){var opts={};if(0===internalPath.indexOf("model.")){var internalModelName=internalPath.slice(6);fluid.set(opts,"model",fluid.get(opts,"model")||{}),fluid.prefs.addCommonOptions(opts,"model",modelCommonOptions,{internalModelName:internalModelName,externalModelName:flattenedPrefKey}),fluid.set(initialModel,["members","initialModel","preferences",flattenedPrefKey],prefSchema[primaryPath])}else fluid.set(opts,internalPath,prefSchema[primaryPath]);$.extend(!0,componentOptions,opts)}}),fluid.prefs.addCommonOptions(components,memberName,commonOptions,{prefKey:memberName}),fluid.prefs.addAtPath(auxSchema,[type,"components"],components),fluid.prefs.addAtPath(auxSchema,[type,"selectors"],selectors),fluid.prefs.addAtPath(auxSchema,["templateLoader","resources"],templates),fluid.prefs.addAtPath(auxSchema,["messageLoader","resources"],messages),fluid.prefs.addAtPath(auxSchema,"initialModel",initialModel)}return auxSchema},fluid.prefs.expandSchemaImpl=function(schemaToExpand,altSource){var expandedSchema=fluid.copy(schemaToExpand);return altSource=altSource||expandedSchema,fluid.each(expandedSchema,function(value,key){if("object"==typeof value)expandedSchema[key]=fluid.prefs.expandSchemaImpl(value,altSource);else if("string"==typeof value){var expandedVal=fluid.prefs.expandSchemaValue(altSource,value);void 0!==expandedVal?expandedSchema[key]=expandedVal:delete expandedSchema[key]}}),expandedSchema},fluid.prefs.expandCompositePanels=function(auxSchema,compositePanelList,panelIndex,panelCommonOptions,subPanelCommonOptions,compositePanelBasedOnSubCommonOptions,panelModelCommonOptions,mappedDefaults){var panelsToIgnore=[];return fluid.each(compositePanelList,function(compositeDetail,compositeKey){var compositePanelOptions={},components={},initialModel={},selectors={},templates={},messages={},selectorsToIgnore=[],thisCompositeOptions=fluid.copy(compositeDetail);fluid.set(compositePanelOptions,"type",thisCompositeOptions.type),delete thisCompositeOptions.type,selectors=fluid.prefs.rearrangeDirect(thisCompositeOptions,compositeKey,"container"),templates=fluid.prefs.rearrangeDirect(thisCompositeOptions,compositeKey,"template"),messages=fluid.prefs.rearrangeDirect(thisCompositeOptions,compositeKey,"message");var subPanelList=[],subPanels={},subPanelRenderOn={};fluid.isPlainObject(thisCompositeOptions.panels)&&!fluid.isArrayable(thisCompositeOptions.panels)?fluid.each(thisCompositeOptions.panels,function(subpanelArray,pref){subPanelList=subPanelList.concat(subpanelArray),"always"!==pref&&fluid.each(subpanelArray,function(onePanel){fluid.set(subPanelRenderOn,onePanel,pref)})}):subPanelList=thisCompositeOptions.panels,fluid.each(subPanelList,function(subPanelID){panelsToIgnore.push(subPanelID);var subPanelPrefsKey=fluid.get(auxSchema,[subPanelID,"type"]),safeSubPanelPrefsKey=fluid.prefs.subPanel.safePrefKey(subPanelPrefsKey);selectorsToIgnore.push(safeSubPanelPrefsKey);var subPanelOptions=fluid.copy(fluid.get(auxSchema,[subPanelID,"panel"])),subPanelType=fluid.get(subPanelOptions,"type");fluid.set(subPanels,[safeSubPanelPrefsKey,"type"],subPanelType);var renderOn=fluid.get(subPanelRenderOn,subPanelID);renderOn&&fluid.set(subPanels,[safeSubPanelPrefsKey,"options","renderOnPreference"],renderOn);var map=fluid.defaults(subPanelType).preferenceMap[subPanelPrefsKey],prefSchema=mappedDefaults[subPanelPrefsKey];fluid.each(map,function(primaryPath,internalPath){if(fluid.prefs.checkPrimarySchema(prefSchema,subPanelPrefsKey)){var opts;0===internalPath.indexOf("model.")?(fluid.set(compositePanelOptions,["options","model"],fluid.get(compositePanelOptions,["options","model"])||{}),fluid.prefs.addCommonOptions(compositePanelOptions,["options","model"],panelModelCommonOptions,{internalModelName:safeSubPanelPrefsKey,externalModelName:safeSubPanelPrefsKey}),fluid.set(initialModel,["members","initialModel","preferences",safeSubPanelPrefsKey],prefSchema[primaryPath])):(opts=opts||{options:{}},fluid.set(opts,"options."+internalPath,prefSchema[primaryPath])),$.extend(!0,subPanels[safeSubPanelPrefsKey],opts)}}),fluid.set(templates,safeSubPanelPrefsKey,fluid.get(subPanelOptions,"template")),fluid.set(messages,safeSubPanelPrefsKey,fluid.get(subPanelOptions,"message")),fluid.set(compositePanelOptions,["options","selectors",safeSubPanelPrefsKey],fluid.get(subPanelOptions,"container")),fluid.set(compositePanelOptions,["options","resources"],fluid.get(compositePanelOptions,["options","resources"])||{}),fluid.prefs.addCommonOptions(compositePanelOptions.options,"resources",compositePanelBasedOnSubCommonOptions,{subPrefKey:safeSubPanelPrefsKey}),delete subPanelOptions.type,delete subPanelOptions.template,delete subPanelOptions.message,delete subPanelOptions.container,fluid.set(subPanels,[safeSubPanelPrefsKey,"options"],$.extend(!0,{},fluid.get(subPanels,[safeSubPanelPrefsKey,"options"]),subPanelOptions)),fluid.prefs.addCommonOptions(subPanels,safeSubPanelPrefsKey,subPanelCommonOptions,{compositePanel:compositeKey,prefKey:safeSubPanelPrefsKey})}),delete thisCompositeOptions.panels,fluid.set(compositePanelOptions,["options"],$.extend(!0,{},compositePanelOptions.options,thisCompositeOptions)),fluid.set(compositePanelOptions,["options","selectorsToIgnore"],selectorsToIgnore),fluid.set(compositePanelOptions,["options","components"],subPanels),components[compositeKey]=compositePanelOptions,fluid.prefs.addCommonOptions(components,compositeKey,panelCommonOptions,{prefKey:compositeKey}),fluid.prefs.addAtPath(auxSchema,["panels","components"],components),fluid.prefs.addAtPath(auxSchema,["panels","selectors"],selectors),fluid.prefs.addAtPath(auxSchema,["templateLoader","resources"],templates),fluid.prefs.addAtPath(auxSchema,["messageLoader","resources"],messages),fluid.prefs.addAtPath(auxSchema,"initialModel",initialModel),$.extend(!0,auxSchema,{panelsToIgnore:panelsToIgnore})}),auxSchema},fluid.prefs.expandSchema=function(schemaToExpand,indexes,topCommonOptions,elementCommonOptions,mappedDefaults){var auxSchema=fluid.prefs.expandSchemaImpl(schemaToExpand);auxSchema.namespace=auxSchema.namespace||"fluid.prefs.created_"+fluid.allocateGuid();var terms=fluid.get(auxSchema,"terms");terms&&(delete auxSchema.terms,fluid.set(auxSchema,["terms","terms"],terms));var compositePanelList=fluid.get(auxSchema,"groups");return compositePanelList&&fluid.prefs.expandCompositePanels(auxSchema,compositePanelList,fluid.get(indexes,"panel"),fluid.get(elementCommonOptions,"panel"),fluid.get(elementCommonOptions,"subPanel"),fluid.get(elementCommonOptions,"compositePanelBasedOnSub"),fluid.get(elementCommonOptions,"panelModel"),mappedDefaults),fluid.each(auxSchema,function(category,prefName){var type="panel";category[type]&&!fluid.contains(auxSchema.panelsToIgnore,prefName)&&fluid.prefs.expandSchemaComponents(auxSchema,"panels",category.type,category[type],fluid.get(indexes,type),fluid.get(elementCommonOptions,type),fluid.get(elementCommonOptions,type+"Model"),mappedDefaults),type="enactor",category[type]&&fluid.prefs.expandSchemaComponents(auxSchema,"enactors",category.type,category[type],fluid.get(indexes,type),fluid.get(elementCommonOptions,type),fluid.get(elementCommonOptions,type+"Model"),mappedDefaults),fluid.each(["template","message"],function(type){prefName===type&&(fluid.set(auxSchema,[type+"Loader","resources","prefsEditor"],auxSchema[type]),delete auxSchema[type])})}),auxSchema.panelsToIgnore&&delete auxSchema.panelsToIgnore,fluid.each(topCommonOptions,function(topOptions,type){fluid.prefs.addCommonOptions(auxSchema,type,topOptions)}),auxSchema},fluid.defaults("fluid.prefs.auxBuilder",{gradeNames:["fluid.prefs.auxSchema"],mergePolicy:{elementCommonOptions:"noexpand"},topCommonOptions:{panels:{gradeNames:["fluid.prefs.prefsEditor"]},enactors:{gradeNames:["fluid.uiEnhancer"]},templateLoader:{gradeNames:["fluid.resourceLoader"]},messageLoader:{gradeNames:["fluid.resourceLoader"]},initialModel:{gradeNames:["fluid.prefs.initialModel"]},terms:{gradeNames:["fluid.component"]}},elementCommonOptions:{panel:{createOnEvent:"onPrefsEditorMarkupReady",container:"{prefsEditor}.dom.%prefKey","options.gradeNames":"fluid.prefs.prefsEditorConnections","options.resources.template":"{templateLoader}.resources.%prefKey","options.messageBase":"{messageLoader}.resources.%prefKey.resourceText"},panelModel:{"%internalModelName":"{prefsEditor}.model.preferences.%externalModelName"},compositePanelBasedOnSub:{"%subPrefKey":"{templateLoader}.resources.%subPrefKey"},subPanel:{container:"{%compositePanel}.dom.%prefKey","options.messageBase":"{messageLoader}.resources.%prefKey.resourceText"},enactor:{container:"{uiEnhancer}.container"},enactorModel:{"%internalModelName":"{uiEnhancer}.model.%externalModelName"}},indexes:{panel:{expander:{func:"fluid.indexDefaults",args:["panelsIndex",{gradeNames:"fluid.prefs.panel",indexFunc:"fluid.prefs.auxBuilder.prefMapIndexer"}]}},enactor:{expander:{func:"fluid.indexDefaults",args:["enactorsIndex",{gradeNames:"fluid.prefs.enactor",indexFunc:"fluid.prefs.auxBuilder.prefMapIndexer"}]}}},mappedDefaults:{},expandedAuxSchema:{expander:{func:"fluid.prefs.expandSchema",args:["{that}.options.auxiliarySchema","{that}.options.indexes","{that}.options.topCommonOptions","{that}.options.elementCommonOptions","{that}.options.mappedDefaults"]}}}),fluid.prefs.auxBuilder.prefMapIndexer=function(defaults){return fluid.keys(defaults.preferenceMap)}}(jQuery,fluid_2_0_0);