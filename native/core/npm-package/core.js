(function (_, kotlin_kotlin, kotlin_org_jetbrains_kotlinx_kotlinx_serialization_json) {
  'use strict';
  //region block: imports
  var println = kotlin_kotlin.$_$.h;
  var Unit_instance = kotlin_kotlin.$_$.f;
  var VOID = kotlin_kotlin.$_$.b;
  var Json = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_json.$_$.a;
  //endregion
  //region block: pre-declaration
  //endregion
  var json;
  function main() {
    _init_properties_CoreEntry_kt__6vdwo1();
    println('TodoTxt Core JS module loaded');
    println('Exports: parseTodoContentJs, streakForHabitJs, momentumForHabitJs, heatmapForHabitJs, mergeHabitsJs');
  }
  function json$lambda($this$Json) {
    _init_properties_CoreEntry_kt__6vdwo1();
    $this$Json.v5_1 = true;
    return Unit_instance;
  }
  var properties_initialized_CoreEntry_kt_d4bg6b;
  function _init_properties_CoreEntry_kt__6vdwo1() {
    if (!properties_initialized_CoreEntry_kt_d4bg6b) {
      properties_initialized_CoreEntry_kt_d4bg6b = true;
      json = Json(VOID, json$lambda);
    }
  }
  function mainWrapper() {
    main();
  }
  mainWrapper();
  return _;
}(module.exports, require('./kotlin-kotlin-stdlib.js'), require('./kotlinx-serialization-kotlinx-serialization-json.js')));

//# sourceMappingURL=todotxt-native-core.js.map
