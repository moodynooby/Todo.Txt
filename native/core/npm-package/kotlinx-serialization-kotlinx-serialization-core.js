(function (_, kotlin_kotlin) {
  'use strict';
  //region block: imports
  var protoOf = kotlin_kotlin.$_$.q;
  var initMetadataForInterface = kotlin_kotlin.$_$.n;
  var initMetadataForObject = kotlin_kotlin.$_$.o;
  var VOID = kotlin_kotlin.$_$.b;
  var getKClassFromExpression = kotlin_kotlin.$_$.a;
  var ensureNotNull = kotlin_kotlin.$_$.v;
  var getStringHashCode = kotlin_kotlin.$_$.l;
  var initMetadataForClass = kotlin_kotlin.$_$.m;
  var noWhenBranchMatchedException = kotlin_kotlin.$_$.w;
  var Unit_instance = kotlin_kotlin.$_$.f;
  var THROW_CCE = kotlin_kotlin.$_$.u;
  var KClass = kotlin_kotlin.$_$.s;
  var isInterface = kotlin_kotlin.$_$.p;
  var emptyMap = kotlin_kotlin.$_$.g;
  //endregion
  //region block: pre-declaration
  initMetadataForInterface(KSerializer, 'KSerializer');
  initMetadataForClass(SerialKind, 'SerialKind');
  initMetadataForObject(ENUM, 'ENUM', VOID, SerialKind);
  initMetadataForObject(CONTEXTUAL, 'CONTEXTUAL', VOID, SerialKind);
  initMetadataForClass(PolymorphicKind, 'PolymorphicKind', VOID, SerialKind);
  initMetadataForClass(PrimitiveKind, 'PrimitiveKind', VOID, SerialKind);
  initMetadataForClass(StructureKind, 'StructureKind', VOID, SerialKind);
  initMetadataForObject(LIST, 'LIST', VOID, StructureKind);
  initMetadataForObject(MAP, 'MAP', VOID, StructureKind);
  initMetadataForClass(SerializersModule, 'SerializersModule');
  initMetadataForClass(SerialModuleImpl, 'SerialModuleImpl', VOID, SerializersModule);
  initMetadataForClass(ContextualProvider, 'ContextualProvider');
  initMetadataForClass(Argless, 'Argless', VOID, ContextualProvider);
  initMetadataForClass(WithTypeArguments, 'WithTypeArguments', VOID, ContextualProvider);
  function contextual(kClass, serializer) {
    return this.j5(kClass, SerializersModuleCollector$contextual$lambda(serializer));
  }
  initMetadataForInterface(SerializersModuleCollector, 'SerializersModuleCollector');
  //endregion
  function KSerializer() {
  }
  function ENUM() {
  }
  function CONTEXTUAL() {
    CONTEXTUAL_instance = this;
    SerialKind.call(this);
  }
  var CONTEXTUAL_instance;
  function CONTEXTUAL_getInstance() {
    if (CONTEXTUAL_instance == null)
      new CONTEXTUAL();
    return CONTEXTUAL_instance;
  }
  function SerialKind() {
  }
  protoOf(SerialKind).toString = function () {
    return ensureNotNull(getKClassFromExpression(this).q3());
  };
  protoOf(SerialKind).hashCode = function () {
    return getStringHashCode(this.toString());
  };
  function PolymorphicKind() {
  }
  function PrimitiveKind() {
  }
  function LIST() {
    LIST_instance = this;
    StructureKind.call(this);
  }
  var LIST_instance;
  function LIST_getInstance() {
    if (LIST_instance == null)
      new LIST();
    return LIST_instance;
  }
  function MAP() {
    MAP_instance = this;
    StructureKind.call(this);
  }
  var MAP_instance;
  function MAP_getInstance() {
    if (MAP_instance == null)
      new MAP();
    return MAP_instance;
  }
  function StructureKind() {
    SerialKind.call(this);
  }
  function get_EmptySerializersModuleLegacyJs() {
    _init_properties_SerializersModule_kt__u78ha3();
    return EmptySerializersModule;
  }
  var EmptySerializersModule;
  function SerializersModule() {
  }
  function SerialModuleImpl(class2ContextualFactory, polyBase2Serializers, polyBase2DefaultSerializerProvider, polyBase2NamedSerializers, polyBase2DefaultDeserializerProvider, hasInterfaceContextualSerializers) {
    SerializersModule.call(this);
    this.c5_1 = class2ContextualFactory;
    this.d5_1 = polyBase2Serializers;
    this.e5_1 = polyBase2DefaultSerializerProvider;
    this.f5_1 = polyBase2NamedSerializers;
    this.g5_1 = polyBase2DefaultDeserializerProvider;
    this.h5_1 = hasInterfaceContextualSerializers;
  }
  protoOf(SerialModuleImpl).b5 = function (collector) {
    // Inline function 'kotlin.collections.forEach' call
    // Inline function 'kotlin.collections.iterator' call
    var _iterator__ex2g4s = this.c5_1.o().d();
    while (_iterator__ex2g4s.e()) {
      var element = _iterator__ex2g4s.f();
      // Inline function 'kotlin.collections.component1' call
      var kclass = element.k();
      // Inline function 'kotlin.collections.component2' call
      var serial = element.l();
      if (serial instanceof Argless) {
        var tmp = isInterface(kclass, KClass) ? kclass : THROW_CCE();
        var tmp_0 = serial.k5_1;
        collector.l5(tmp, isInterface(tmp_0, KSerializer) ? tmp_0 : THROW_CCE());
      } else {
        if (serial instanceof WithTypeArguments) {
          collector.j5(kclass, serial.i5_1);
        } else {
          noWhenBranchMatchedException();
        }
      }
    }
    // Inline function 'kotlin.collections.forEach' call
    // Inline function 'kotlin.collections.iterator' call
    var _iterator__ex2g4s_0 = this.d5_1.o().d();
    while (_iterator__ex2g4s_0.e()) {
      var element_0 = _iterator__ex2g4s_0.f();
      // Inline function 'kotlin.collections.component1' call
      var baseClass = element_0.k();
      // Inline function 'kotlin.collections.component2' call
      var classMap = element_0.l();
      // Inline function 'kotlin.collections.forEach' call
      // Inline function 'kotlin.collections.iterator' call
      var _iterator__ex2g4s_1 = classMap.o().d();
      while (_iterator__ex2g4s_1.e()) {
        var element_1 = _iterator__ex2g4s_1.f();
        // Inline function 'kotlin.collections.component1' call
        var actualClass = element_1.k();
        // Inline function 'kotlin.collections.component2' call
        var serializer = element_1.l();
        var tmp_1 = isInterface(baseClass, KClass) ? baseClass : THROW_CCE();
        var tmp_2 = isInterface(actualClass, KClass) ? actualClass : THROW_CCE();
        // Inline function 'kotlinx.serialization.internal.cast' call
        var tmp$ret$11 = isInterface(serializer, KSerializer) ? serializer : THROW_CCE();
        collector.m5(tmp_1, tmp_2, tmp$ret$11);
      }
    }
    // Inline function 'kotlin.collections.forEach' call
    // Inline function 'kotlin.collections.iterator' call
    var _iterator__ex2g4s_2 = this.e5_1.o().d();
    while (_iterator__ex2g4s_2.e()) {
      var element_2 = _iterator__ex2g4s_2.f();
      // Inline function 'kotlin.collections.component1' call
      var baseClass_0 = element_2.k();
      // Inline function 'kotlin.collections.component2' call
      var provider = element_2.l();
      var tmp_3 = isInterface(baseClass_0, KClass) ? baseClass_0 : THROW_CCE();
      collector.n5(tmp_3, typeof provider === 'function' ? provider : THROW_CCE());
    }
    // Inline function 'kotlin.collections.forEach' call
    // Inline function 'kotlin.collections.iterator' call
    var _iterator__ex2g4s_3 = this.g5_1.o().d();
    while (_iterator__ex2g4s_3.e()) {
      var element_3 = _iterator__ex2g4s_3.f();
      // Inline function 'kotlin.collections.component1' call
      var baseClass_1 = element_3.k();
      // Inline function 'kotlin.collections.component2' call
      var provider_0 = element_3.l();
      var tmp_4 = isInterface(baseClass_1, KClass) ? baseClass_1 : THROW_CCE();
      collector.o5(tmp_4, typeof provider_0 === 'function' ? provider_0 : THROW_CCE());
    }
  };
  function Argless() {
  }
  function WithTypeArguments() {
  }
  function ContextualProvider() {
  }
  var properties_initialized_SerializersModule_kt_fjigjn;
  function _init_properties_SerializersModule_kt__u78ha3() {
    if (!properties_initialized_SerializersModule_kt_fjigjn) {
      properties_initialized_SerializersModule_kt_fjigjn = true;
      EmptySerializersModule = new SerialModuleImpl(emptyMap(), emptyMap(), emptyMap(), emptyMap(), emptyMap(), false);
    }
  }
  function EmptySerializersModule_0() {
    return get_EmptySerializersModuleLegacyJs();
  }
  function SerializersModuleCollector$contextual$lambda($serializer) {
    return function (it) {
      return $serializer;
    };
  }
  function SerializersModuleCollector() {
  }
  //region block: exports
  _.$_$ = _.$_$ || {};
  _.$_$.a = CONTEXTUAL_getInstance;
  _.$_$.b = LIST_getInstance;
  _.$_$.c = MAP_getInstance;
  _.$_$.d = PolymorphicKind;
  _.$_$.e = PrimitiveKind;
  _.$_$.f = ENUM;
  _.$_$.g = EmptySerializersModule_0;
  _.$_$.h = contextual;
  _.$_$.i = SerializersModuleCollector;
  //endregion
  return _;
}(module.exports, require('./kotlin-kotlin-stdlib.js')));

//# sourceMappingURL=kotlinx-serialization-kotlinx-serialization-core.js.map
