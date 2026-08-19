(function (_, kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core, kotlin_kotlin) {
  'use strict';
  //region block: imports
  var EmptySerializersModule = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.g;
  var protoOf = kotlin_kotlin.$_$.q;
  var initMetadataForObject = kotlin_kotlin.$_$.o;
  var VOID = kotlin_kotlin.$_$.b;
  var initMetadataForClass = kotlin_kotlin.$_$.m;
  var toString = kotlin_kotlin.$_$.r;
  var IllegalArgumentException_init_$Create$ = kotlin_kotlin.$_$.d;
  var Unit_instance = kotlin_kotlin.$_$.f;
  var charSequenceLength = kotlin_kotlin.$_$.j;
  var charSequenceGet = kotlin_kotlin.$_$.i;
  var _Char___init__impl__6a9atx = kotlin_kotlin.$_$.e;
  var equals = kotlin_kotlin.$_$.k;
  var toString_0 = kotlin_kotlin.$_$.x;
  var Enum = kotlin_kotlin.$_$.t;
  var CONTEXTUAL_getInstance = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.a;
  var PolymorphicKind = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.d;
  var PrimitiveKind = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.e;
  var LIST_getInstance = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.b;
  var MAP_getInstance = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.c;
  var ENUM = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.f;
  var contextual = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.h;
  var SerializersModuleCollector = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.i;
  var HashMap_init_$Create$ = kotlin_kotlin.$_$.c;
  //endregion
  //region block: pre-declaration
  initMetadataForClass(Json, 'Json');
  initMetadataForObject(Default, 'Default', VOID, Json);
  initMetadataForClass(JsonBuilder, 'JsonBuilder');
  initMetadataForClass(JsonImpl, 'JsonImpl', VOID, Json);
  initMetadataForClass(JsonConfiguration, 'JsonConfiguration');
  initMetadataForClass(ClassDiscriminatorMode, 'ClassDiscriminatorMode', VOID, Enum);
  initMetadataForClass(PolymorphismValidator, 'PolymorphismValidator', VOID, VOID, [SerializersModuleCollector]);
  initMetadataForClass(DescriptorSchemaCache, 'DescriptorSchemaCache', DescriptorSchemaCache);
  //endregion
  function Default() {
    Default_instance = this;
    Json.call(this, new JsonConfiguration(), EmptySerializersModule());
  }
  var Default_instance;
  function Default_getInstance() {
    if (Default_instance == null)
      new Default();
    return Default_instance;
  }
  function Json(configuration, serializersModule) {
    Default_getInstance();
    this.p5_1 = configuration;
    this.q5_1 = serializersModule;
    this.r5_1 = new DescriptorSchemaCache();
  }
  protoOf(Json).s5 = function () {
    return this.q5_1;
  };
  function Json_0(from, builderAction) {
    from = from === VOID ? Default_getInstance() : from;
    var builder = new JsonBuilder(from);
    builderAction(builder);
    var conf = builder.l6();
    return new JsonImpl(conf, builder.k6_1);
  }
  function JsonBuilder(json) {
    this.t5_1 = json.p5_1.m6_1;
    this.u5_1 = json.p5_1.r6_1;
    this.v5_1 = json.p5_1.n6_1;
    this.w5_1 = json.p5_1.o6_1;
    this.x5_1 = json.p5_1.q6_1;
    this.y5_1 = json.p5_1.s6_1;
    this.z5_1 = json.p5_1.t6_1;
    this.a6_1 = json.p5_1.v6_1;
    this.b6_1 = json.p5_1.c7_1;
    this.c6_1 = json.p5_1.x6_1;
    this.d6_1 = json.p5_1.y6_1;
    this.e6_1 = json.p5_1.z6_1;
    this.f6_1 = json.p5_1.a7_1;
    this.g6_1 = json.p5_1.b7_1;
    this.h6_1 = json.p5_1.w6_1;
    this.i6_1 = json.p5_1.p6_1;
    this.j6_1 = json.p5_1.u6_1;
    this.k6_1 = json.s5();
  }
  protoOf(JsonBuilder).l6 = function () {
    if (this.j6_1) {
      // Inline function 'kotlin.require' call
      if (!(this.a6_1 === 'type')) {
        var message = 'Class discriminator should not be specified when array polymorphism is specified';
        throw IllegalArgumentException_init_$Create$(toString(message));
      }
      // Inline function 'kotlin.require' call
      if (!this.b6_1.equals(ClassDiscriminatorMode_POLYMORPHIC_getInstance())) {
        var message_0 = 'useArrayPolymorphism option can only be used if classDiscriminatorMode in a default POLYMORPHIC state.';
        throw IllegalArgumentException_init_$Create$(toString(message_0));
      }
    }
    if (!this.x5_1) {
      // Inline function 'kotlin.require' call
      if (!(this.y5_1 === '    ')) {
        var message_1 = 'Indent should not be specified when default printing mode is used';
        throw IllegalArgumentException_init_$Create$(toString(message_1));
      }
    } else if (!(this.y5_1 === '    ')) {
      var tmp3 = this.y5_1;
      var tmp$ret$7;
      $l$block: {
        // Inline function 'kotlin.text.all' call
        var inductionVariable = 0;
        while (inductionVariable < charSequenceLength(tmp3)) {
          var element = charSequenceGet(tmp3, inductionVariable);
          inductionVariable = inductionVariable + 1 | 0;
          if (!(element === _Char___init__impl__6a9atx(32) || element === _Char___init__impl__6a9atx(9) || element === _Char___init__impl__6a9atx(13) || element === _Char___init__impl__6a9atx(10))) {
            tmp$ret$7 = false;
            break $l$block;
          }
        }
        tmp$ret$7 = true;
      }
      var allWhitespaces = tmp$ret$7;
      // Inline function 'kotlin.require' call
      if (!allWhitespaces) {
        var message_2 = 'Only whitespace, tab, newline and carriage return are allowed as pretty print symbols. Had ' + this.y5_1;
        throw IllegalArgumentException_init_$Create$(toString(message_2));
      }
    }
    return new JsonConfiguration(this.t5_1, this.v5_1, this.w5_1, this.i6_1, this.x5_1, this.u5_1, this.y5_1, this.z5_1, this.j6_1, this.a6_1, this.h6_1, this.c6_1, this.d6_1, this.e6_1, this.f6_1, this.g6_1, this.b6_1);
  };
  function validateConfiguration($this) {
    if (equals($this.s5(), EmptySerializersModule()))
      return Unit_instance;
    var collector = new PolymorphismValidator($this.p5_1.u6_1, $this.p5_1.v6_1);
    $this.s5().b5(collector);
  }
  function JsonImpl(configuration, module_0) {
    Json.call(this, configuration, module_0);
    validateConfiguration(this);
  }
  function JsonConfiguration(encodeDefaults, ignoreUnknownKeys, isLenient, allowStructuredMapKeys, prettyPrint, explicitNulls, prettyPrintIndent, coerceInputValues, useArrayPolymorphism, classDiscriminator, allowSpecialFloatingPointValues, useAlternativeNames, namingStrategy, decodeEnumsCaseInsensitive, allowTrailingComma, allowComments, classDiscriminatorMode) {
    encodeDefaults = encodeDefaults === VOID ? false : encodeDefaults;
    ignoreUnknownKeys = ignoreUnknownKeys === VOID ? false : ignoreUnknownKeys;
    isLenient = isLenient === VOID ? false : isLenient;
    allowStructuredMapKeys = allowStructuredMapKeys === VOID ? false : allowStructuredMapKeys;
    prettyPrint = prettyPrint === VOID ? false : prettyPrint;
    explicitNulls = explicitNulls === VOID ? true : explicitNulls;
    prettyPrintIndent = prettyPrintIndent === VOID ? '    ' : prettyPrintIndent;
    coerceInputValues = coerceInputValues === VOID ? false : coerceInputValues;
    useArrayPolymorphism = useArrayPolymorphism === VOID ? false : useArrayPolymorphism;
    classDiscriminator = classDiscriminator === VOID ? 'type' : classDiscriminator;
    allowSpecialFloatingPointValues = allowSpecialFloatingPointValues === VOID ? false : allowSpecialFloatingPointValues;
    useAlternativeNames = useAlternativeNames === VOID ? true : useAlternativeNames;
    namingStrategy = namingStrategy === VOID ? null : namingStrategy;
    decodeEnumsCaseInsensitive = decodeEnumsCaseInsensitive === VOID ? false : decodeEnumsCaseInsensitive;
    allowTrailingComma = allowTrailingComma === VOID ? false : allowTrailingComma;
    allowComments = allowComments === VOID ? false : allowComments;
    classDiscriminatorMode = classDiscriminatorMode === VOID ? ClassDiscriminatorMode_POLYMORPHIC_getInstance() : classDiscriminatorMode;
    this.m6_1 = encodeDefaults;
    this.n6_1 = ignoreUnknownKeys;
    this.o6_1 = isLenient;
    this.p6_1 = allowStructuredMapKeys;
    this.q6_1 = prettyPrint;
    this.r6_1 = explicitNulls;
    this.s6_1 = prettyPrintIndent;
    this.t6_1 = coerceInputValues;
    this.u6_1 = useArrayPolymorphism;
    this.v6_1 = classDiscriminator;
    this.w6_1 = allowSpecialFloatingPointValues;
    this.x6_1 = useAlternativeNames;
    this.y6_1 = namingStrategy;
    this.z6_1 = decodeEnumsCaseInsensitive;
    this.a7_1 = allowTrailingComma;
    this.b7_1 = allowComments;
    this.c7_1 = classDiscriminatorMode;
  }
  protoOf(JsonConfiguration).toString = function () {
    return 'JsonConfiguration(encodeDefaults=' + this.m6_1 + ', ignoreUnknownKeys=' + this.n6_1 + ', isLenient=' + this.o6_1 + ', ' + ('allowStructuredMapKeys=' + this.p6_1 + ', prettyPrint=' + this.q6_1 + ', explicitNulls=' + this.r6_1 + ', ') + ("prettyPrintIndent='" + this.s6_1 + "', coerceInputValues=" + this.t6_1 + ', useArrayPolymorphism=' + this.u6_1 + ', ') + ("classDiscriminator='" + this.v6_1 + "', allowSpecialFloatingPointValues=" + this.w6_1 + ', ') + ('useAlternativeNames=' + this.x6_1 + ', namingStrategy=' + toString_0(this.y6_1) + ', decodeEnumsCaseInsensitive=' + this.z6_1 + ', ') + ('allowTrailingComma=' + this.a7_1 + ', allowComments=' + this.b7_1 + ', classDiscriminatorMode=' + this.c7_1.toString() + ')');
  };
  var ClassDiscriminatorMode_NONE_instance;
  var ClassDiscriminatorMode_ALL_JSON_OBJECTS_instance;
  var ClassDiscriminatorMode_POLYMORPHIC_instance;
  var ClassDiscriminatorMode_entriesInitialized;
  function ClassDiscriminatorMode_initEntries() {
    if (ClassDiscriminatorMode_entriesInitialized)
      return Unit_instance;
    ClassDiscriminatorMode_entriesInitialized = true;
    ClassDiscriminatorMode_NONE_instance = new ClassDiscriminatorMode('NONE', 0);
    ClassDiscriminatorMode_ALL_JSON_OBJECTS_instance = new ClassDiscriminatorMode('ALL_JSON_OBJECTS', 1);
    ClassDiscriminatorMode_POLYMORPHIC_instance = new ClassDiscriminatorMode('POLYMORPHIC', 2);
  }
  function ClassDiscriminatorMode(name, ordinal) {
    Enum.call(this, name, ordinal);
  }
  function ClassDiscriminatorMode_POLYMORPHIC_getInstance() {
    ClassDiscriminatorMode_initEntries();
    return ClassDiscriminatorMode_POLYMORPHIC_instance;
  }
  function checkKind($this, descriptor, actualClass) {
    var kind = descriptor.d7();
    var tmp;
    if (kind instanceof PolymorphicKind) {
      tmp = true;
    } else {
      tmp = equals(kind, CONTEXTUAL_getInstance());
    }
    if (tmp) {
      throw IllegalArgumentException_init_$Create$('Serializer for ' + actualClass.q3() + " can't be registered as a subclass for polymorphic serialization " + ('because its kind ' + kind.toString() + ' is not concrete. To work with multiple hierarchies, register it as a base class.'));
    }
    if ($this.e7_1)
      return Unit_instance;
    var tmp_0;
    var tmp_1;
    if (equals(kind, LIST_getInstance()) || equals(kind, MAP_getInstance())) {
      tmp_1 = true;
    } else {
      tmp_1 = kind instanceof PrimitiveKind;
    }
    if (tmp_1) {
      tmp_0 = true;
    } else {
      tmp_0 = kind instanceof ENUM;
    }
    if (tmp_0) {
      throw IllegalArgumentException_init_$Create$('Serializer for ' + actualClass.q3() + ' of kind ' + kind.toString() + ' cannot be serialized polymorphically with class discriminator.');
    }
  }
  function checkDiscriminatorCollisions($this, descriptor, actualClass) {
    var inductionVariable = 0;
    var last = descriptor.g7();
    if (inductionVariable < last)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        var name = descriptor.h7(i);
        if (name === $this.f7_1) {
          throw IllegalArgumentException_init_$Create$('Polymorphic serializer for ' + toString(actualClass) + " has property '" + name + "' that conflicts " + 'with JSON class discriminator. You can either change class discriminator in JsonConfiguration, ' + 'rename property with @SerialName annotation ' + 'or fall back to array polymorphism');
        }
      }
       while (inductionVariable < last);
  }
  function PolymorphismValidator(useArrayPolymorphism, discriminator) {
    this.e7_1 = useArrayPolymorphism;
    this.f7_1 = discriminator;
  }
  protoOf(PolymorphismValidator).j5 = function (kClass, provider) {
  };
  protoOf(PolymorphismValidator).m5 = function (baseClass, actualClass, actualSerializer) {
    var descriptor = actualSerializer.a5();
    checkKind(this, descriptor, actualClass);
    if (!this.e7_1) {
      checkDiscriminatorCollisions(this, descriptor, actualClass);
    }
  };
  protoOf(PolymorphismValidator).n5 = function (baseClass, defaultSerializerProvider) {
  };
  protoOf(PolymorphismValidator).o5 = function (baseClass, defaultDeserializerProvider) {
  };
  function DescriptorSchemaCache() {
    this.i7_1 = createMapForCache(16);
  }
  function createMapForCache(initialCapacity) {
    return HashMap_init_$Create$(initialCapacity);
  }
  //region block: post-declaration
  protoOf(PolymorphismValidator).l5 = contextual;
  //endregion
  //region block: exports
  _.$_$ = _.$_$ || {};
  _.$_$.a = Json_0;
  //endregion
  return _;
}(module.exports, require('./kotlinx-serialization-kotlinx-serialization-core.js'), require('./kotlin-kotlin-stdlib.js')));

//# sourceMappingURL=kotlinx-serialization-kotlinx-serialization-json.js.map
