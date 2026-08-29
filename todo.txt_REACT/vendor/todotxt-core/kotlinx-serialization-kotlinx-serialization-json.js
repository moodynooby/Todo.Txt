(function (_, kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core, kotlin_kotlin) {
  'use strict';
  //region block: imports
  var imul = Math.imul;
  var EmptySerializersModule = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.a2;
  var protoOf = kotlin_kotlin.$_$.u7;
  var initMetadataForObject = kotlin_kotlin.$_$.b7;
  var VOID = kotlin_kotlin.$_$.f;
  var Unit_instance = kotlin_kotlin.$_$.r3;
  var initMetadataForClass = kotlin_kotlin.$_$.w6;
  var toString = kotlin_kotlin.$_$.y7;
  var IllegalArgumentException_init_$Create$ = kotlin_kotlin.$_$.c1;
  var charSequenceLength = kotlin_kotlin.$_$.o6;
  var charSequenceGet = kotlin_kotlin.$_$.n6;
  var _Char___init__impl__6a9atx = kotlin_kotlin.$_$.j1;
  var equals = kotlin_kotlin.$_$.r6;
  var toString_0 = kotlin_kotlin.$_$.ua;
  var Enum = kotlin_kotlin.$_$.t9;
  var Decoder = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.l1;
  var CompositeDecoder = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.j1;
  var initMetadataForInterface = kotlin_kotlin.$_$.z6;
  var initMetadataForCompanion = kotlin_kotlin.$_$.x6;
  var StringBuilder_init_$Create$ = kotlin_kotlin.$_$.z;
  var hashCode = kotlin_kotlin.$_$.v6;
  var joinToString = kotlin_kotlin.$_$.h5;
  var THROW_CCE = kotlin_kotlin.$_$.y9;
  var KtMap = kotlin_kotlin.$_$.a4;
  var KtList = kotlin_kotlin.$_$.y3;
  var SerializerFactory = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.w1;
  var getKClassFromExpression = kotlin_kotlin.$_$.d;
  var getBooleanHashCode = kotlin_kotlin.$_$.s6;
  var getStringHashCode = kotlin_kotlin.$_$.u6;
  var NumberFormatException_init_$Create$ = kotlin_kotlin.$_$.h1;
  var numberRangeToNumber = kotlin_kotlin.$_$.p7;
  var ClosedRange = kotlin_kotlin.$_$.z7;
  var isInterface = kotlin_kotlin.$_$.k7;
  var contains = kotlin_kotlin.$_$.c8;
  var toDouble = kotlin_kotlin.$_$.b9;
  var StringCompanionObject_instance = kotlin_kotlin.$_$.g3;
  var serializer = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.s;
  var InlinePrimitiveDescriptor = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.s1;
  var LinkedHashMap_init_$Create$ = kotlin_kotlin.$_$.s;
  var SEALED_getInstance = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.d;
  var buildSerialDescriptor = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.f1;
  var noWhenBranchMatchedException = kotlin_kotlin.$_$.sa;
  var KSerializer = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.e2;
  var MapSerializer = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.q;
  var SerialDescriptor = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.d1;
  var ListSerializer = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.p;
  var STRING_getInstance = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.e;
  var ENUM_getInstance = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.g;
  var PrimitiveSerialDescriptor = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.z;
  var toLongOrNull = kotlin_kotlin.$_$.e9;
  var toULongOrNull = kotlin_kotlin.$_$.h9;
  var ULong = kotlin_kotlin.$_$.fa;
  var Companion_getInstance = kotlin_kotlin.$_$.p3;
  var serializer_0 = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.w;
  var _ULong___get_data__impl__fggpzb = kotlin_kotlin.$_$.j2;
  var toDoubleOrNull = kotlin_kotlin.$_$.a9;
  var toBooleanStrictOrNull = kotlin_kotlin.$_$.z8;
  var IllegalStateException_init_$Create$ = kotlin_kotlin.$_$.e1;
  var lazy = kotlin_kotlin.$_$.ra;
  var get_isNullable = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.c1;
  var get_isInline = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.b1;
  var get_annotations = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.a1;
  var KProperty1 = kotlin_kotlin.$_$.h8;
  var getPropertyCallableRef = kotlin_kotlin.$_$.t6;
  var Encoder = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.m1;
  var CompositeEncoder = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.k1;
  var toLong = kotlin_kotlin.$_$.w7;
  var _UInt___init__impl__l7qpdl = kotlin_kotlin.$_$.z1;
  var UInt__toString_impl_dbgl21 = kotlin_kotlin.$_$.b2;
  var _ULong___init__impl__c78o9k = kotlin_kotlin.$_$.i2;
  var ULong__toString_impl_f9au7k = kotlin_kotlin.$_$.k2;
  var _UByte___init__impl__g9hnc4 = kotlin_kotlin.$_$.q1;
  var UByte__toString_impl_v72jg = kotlin_kotlin.$_$.s1;
  var _UShort___init__impl__jigrne = kotlin_kotlin.$_$.r2;
  var UShort__toString_impl_edaoee = kotlin_kotlin.$_$.t2;
  var ElementMarker = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.p1;
  var captureStack = kotlin_kotlin.$_$.k6;
  var SerializationException = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.h2;
  var SerializationException_init_$Init$ = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.a;
  var charSequenceSubSequence = kotlin_kotlin.$_$.p6;
  var coerceAtLeast = kotlin_kotlin.$_$.a8;
  var coerceAtMost = kotlin_kotlin.$_$.b8;
  var SerializationException_init_$Create$ = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.b;
  var CLASS_getInstance = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.h;
  var ArrayList_init_$Create$ = kotlin_kotlin.$_$.j;
  var singleOrNull = kotlin_kotlin.$_$.t5;
  var emptyMap = kotlin_kotlin.$_$.a5;
  var getValue = kotlin_kotlin.$_$.d5;
  var copyOf = kotlin_kotlin.$_$.v4;
  var copyOf_0 = kotlin_kotlin.$_$.w4;
  var LIST_getInstance = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.i;
  var DeepRecursiveFunction = kotlin_kotlin.$_$.r9;
  var invoke = kotlin_kotlin.$_$.na;
  var CoroutineImpl = kotlin_kotlin.$_$.f6;
  var DeepRecursiveScope = kotlin_kotlin.$_$.s9;
  var Unit = kotlin_kotlin.$_$.ia;
  var get_COROUTINE_SUSPENDED = kotlin_kotlin.$_$.e6;
  var initMetadataForLambda = kotlin_kotlin.$_$.a7;
  var initMetadataForCoroutine = kotlin_kotlin.$_$.y6;
  var SealedClassSerializer = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.g2;
  var jsonCachedSerialNames = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.y1;
  var ENUM = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.e1;
  var PrimitiveKind = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.y;
  var PolymorphicKind = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.x;
  var CONTEXTUAL_getInstance = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.f;
  var MAP_getInstance = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.j;
  var contextual = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.b2;
  var SerializersModuleCollector = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.c2;
  var AbstractDecoder = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.h1;
  var AbstractPolymorphicSerializer = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.n1;
  var DeserializationStrategy = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.d2;
  var getKClass = kotlin_kotlin.$_$.e;
  var findPolymorphicSerializer = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.j2;
  var ensureNotNull = kotlin_kotlin.$_$.ma;
  var substringBefore = kotlin_kotlin.$_$.y8;
  var removeSuffix = kotlin_kotlin.$_$.t8;
  var substringAfter = kotlin_kotlin.$_$.x8;
  var contains_0 = kotlin_kotlin.$_$.l8;
  var plus = kotlin_kotlin.$_$.ta;
  var MissingFieldException = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.f2;
  var IllegalArgumentException = kotlin_kotlin.$_$.u9;
  var isFinite = kotlin_kotlin.$_$.pa;
  var isFinite_0 = kotlin_kotlin.$_$.oa;
  var toUInt = kotlin_kotlin.$_$.g9;
  var _UInt___get_data__impl__f0vqqw = kotlin_kotlin.$_$.a2;
  var toULong = kotlin_kotlin.$_$.i9;
  var toUByte = kotlin_kotlin.$_$.f9;
  var _UByte___get_data__impl__jof9qr = kotlin_kotlin.$_$.r1;
  var toUShort = kotlin_kotlin.$_$.j9;
  var _UShort___get_data__impl__g0245 = kotlin_kotlin.$_$.s2;
  var objectCreate = kotlin_kotlin.$_$.t7;
  var AbstractEncoder = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.i1;
  var OBJECT_getInstance = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.k;
  var findPolymorphicSerializer_0 = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.k2;
  var SerializationStrategy = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.i2;
  var toString_1 = kotlin_kotlin.$_$.m1;
  var Companion_getInstance_0 = kotlin_kotlin.$_$.o3;
  var serializer_1 = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.u;
  var Companion_getInstance_1 = kotlin_kotlin.$_$.n3;
  var serializer_2 = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.v;
  var Companion_getInstance_2 = kotlin_kotlin.$_$.q3;
  var serializer_3 = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.t;
  var setOf = kotlin_kotlin.$_$.s5;
  var Char__toInt_impl_vasixd = kotlin_kotlin.$_$.l1;
  var numberToChar = kotlin_kotlin.$_$.q7;
  var equals_0 = kotlin_kotlin.$_$.n8;
  var toByte = kotlin_kotlin.$_$.v7;
  var startsWith = kotlin_kotlin.$_$.w8;
  var NamedValueDecoder = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.u1;
  var toShort = kotlin_kotlin.$_$.x7;
  var single = kotlin_kotlin.$_$.u8;
  var Char = kotlin_kotlin.$_$.p9;
  var emptySet = kotlin_kotlin.$_$.b5;
  var plus_0 = kotlin_kotlin.$_$.p5;
  var toInt = kotlin_kotlin.$_$.d9;
  var toList = kotlin_kotlin.$_$.y5;
  var enumEntries = kotlin_kotlin.$_$.g6;
  var getContextualDescriptor = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.g1;
  var last = kotlin_kotlin.$_$.l5;
  var removeLast = kotlin_kotlin.$_$.r5;
  var lastIndexOf = kotlin_kotlin.$_$.r8;
  var Long = kotlin_kotlin.$_$.v9;
  var Char__minus_impl_a2frrh = kotlin_kotlin.$_$.k1;
  var numberToLong = kotlin_kotlin.$_$.s7;
  var charArray = kotlin_kotlin.$_$.m6;
  var indexOf = kotlin_kotlin.$_$.o8;
  var indexOf_0 = kotlin_kotlin.$_$.p8;
  var StringBuilder_init_$Create$_0 = kotlin_kotlin.$_$.y;
  var HashMap_init_$Create$ = kotlin_kotlin.$_$.l;
  //endregion
  //region block: pre-declaration
  initMetadataForClass(Json, 'Json');
  initMetadataForObject(Default, 'Default', VOID, Json);
  initMetadataForClass(JsonBuilder, 'JsonBuilder');
  initMetadataForClass(JsonImpl, 'JsonImpl', VOID, Json);
  initMetadataForClass(JsonClassDiscriminator, 'JsonClassDiscriminator');
  initMetadataForClass(JsonNames, 'JsonNames');
  initMetadataForClass(JsonConfiguration, 'JsonConfiguration');
  initMetadataForClass(ClassDiscriminatorMode, 'ClassDiscriminatorMode', VOID, Enum);
  initMetadataForInterface(JsonDecoder, 'JsonDecoder', VOID, VOID, [Decoder, CompositeDecoder]);
  initMetadataForCompanion(Companion);
  initMetadataForClass(JsonElement, 'JsonElement', VOID, VOID, VOID, VOID, VOID, {0: JsonElementSerializer_getInstance});
  initMetadataForClass(JsonObject, 'JsonObject', VOID, JsonElement, [JsonElement, KtMap], VOID, VOID, {0: JsonObjectSerializer_getInstance});
  initMetadataForCompanion(Companion_0);
  initMetadataForCompanion(Companion_1);
  initMetadataForClass(JsonArray, 'JsonArray', VOID, JsonElement, [JsonElement, KtList], VOID, VOID, {0: JsonArraySerializer_getInstance});
  initMetadataForCompanion(Companion_2);
  initMetadataForClass(JsonPrimitive, 'JsonPrimitive', VOID, JsonElement, VOID, VOID, VOID, {0: JsonPrimitiveSerializer_getInstance});
  initMetadataForObject(JsonNull, 'JsonNull', VOID, JsonPrimitive, [JsonPrimitive, SerializerFactory], VOID, VOID, {0: JsonNullSerializer_getInstance});
  initMetadataForClass(JsonLiteral, 'JsonLiteral', VOID, JsonPrimitive);
  initMetadataForClass(JsonObjectBuilder, 'JsonObjectBuilder');
  initMetadataForObject(JsonElementSerializer, 'JsonElementSerializer', VOID, VOID, [KSerializer]);
  initMetadataForObject(JsonObjectDescriptor, 'JsonObjectDescriptor', VOID, VOID, [SerialDescriptor]);
  initMetadataForObject(JsonObjectSerializer, 'JsonObjectSerializer', VOID, VOID, [KSerializer]);
  initMetadataForObject(JsonArrayDescriptor, 'JsonArrayDescriptor', VOID, VOID, [SerialDescriptor]);
  initMetadataForObject(JsonArraySerializer, 'JsonArraySerializer', VOID, VOID, [KSerializer]);
  initMetadataForObject(JsonPrimitiveSerializer, 'JsonPrimitiveSerializer', VOID, VOID, [KSerializer]);
  initMetadataForObject(JsonNullSerializer, 'JsonNullSerializer', VOID, VOID, [KSerializer]);
  initMetadataForObject(JsonLiteralSerializer, 'JsonLiteralSerializer', VOID, VOID, [KSerializer]);
  initMetadataForClass(defer$1, VOID, VOID, VOID, [SerialDescriptor]);
  initMetadataForInterface(JsonEncoder, 'JsonEncoder', VOID, VOID, [Encoder, CompositeEncoder]);
  initMetadataForClass(Composer, 'Composer');
  initMetadataForClass(ComposerForUnsignedNumbers, 'ComposerForUnsignedNumbers', VOID, Composer);
  initMetadataForClass(ComposerForUnquotedLiterals, 'ComposerForUnquotedLiterals', VOID, Composer);
  initMetadataForClass(ComposerWithPrettyPrint, 'ComposerWithPrettyPrint', VOID, Composer);
  initMetadataForClass(JsonElementMarker, 'JsonElementMarker');
  initMetadataForClass(JsonException, 'JsonException', VOID, SerializationException);
  initMetadataForClass(JsonEncodingException, 'JsonEncodingException', VOID, JsonException);
  initMetadataForClass(JsonDecodingException, 'JsonDecodingException', VOID, JsonException);
  initMetadataForObject(Tombstone, 'Tombstone');
  initMetadataForClass(JsonPath, 'JsonPath', JsonPath);
  initMetadataForLambda(JsonTreeReader$readDeepRecursive$slambda, CoroutineImpl, VOID, [2]);
  initMetadataForCoroutine($readObjectCOROUTINE$0, CoroutineImpl);
  initMetadataForClass(JsonTreeReader, 'JsonTreeReader', VOID, VOID, VOID, [0]);
  initMetadataForClass(PolymorphismValidator, 'PolymorphismValidator', VOID, VOID, [SerializersModuleCollector]);
  initMetadataForClass(Key, 'Key', Key);
  initMetadataForClass(DescriptorSchemaCache, 'DescriptorSchemaCache', DescriptorSchemaCache);
  initMetadataForClass(DiscriminatorHolder, 'DiscriminatorHolder');
  initMetadataForClass(StreamingJsonDecoder, 'StreamingJsonDecoder', VOID, AbstractDecoder, [JsonDecoder, AbstractDecoder]);
  initMetadataForClass(JsonDecoderForUnsignedTypes, 'JsonDecoderForUnsignedTypes', VOID, AbstractDecoder);
  initMetadataForClass(StreamingJsonEncoder, 'StreamingJsonEncoder', VOID, AbstractEncoder, [JsonEncoder, AbstractEncoder]);
  initMetadataForClass(AbstractJsonTreeDecoder, 'AbstractJsonTreeDecoder', VOID, NamedValueDecoder, [NamedValueDecoder, JsonDecoder]);
  initMetadataForClass(JsonTreeDecoder, 'JsonTreeDecoder', VOID, AbstractJsonTreeDecoder);
  initMetadataForClass(JsonTreeListDecoder, 'JsonTreeListDecoder', VOID, AbstractJsonTreeDecoder);
  initMetadataForClass(JsonPrimitiveDecoder, 'JsonPrimitiveDecoder', VOID, AbstractJsonTreeDecoder);
  initMetadataForClass(JsonTreeMapDecoder, 'JsonTreeMapDecoder', VOID, JsonTreeDecoder);
  initMetadataForClass(WriteMode, 'WriteMode', VOID, Enum);
  initMetadataForClass(AbstractJsonLexer, 'AbstractJsonLexer');
  initMetadataForObject(CharMappings, 'CharMappings');
  initMetadataForClass(StringJsonLexer, 'StringJsonLexer', VOID, AbstractJsonLexer);
  initMetadataForClass(StringJsonLexerWithComments, 'StringJsonLexerWithComments', VOID, StringJsonLexer);
  initMetadataForClass(JsonToStringWriter, 'JsonToStringWriter', JsonToStringWriter);
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
    this.q12_1 = configuration;
    this.r12_1 = serializersModule;
    this.s12_1 = new DescriptorSchemaCache();
  }
  protoOf(Json).gm = function () {
    return this.r12_1;
  };
  protoOf(Json).t12 = function (serializer, value) {
    var result = new JsonToStringWriter();
    try {
      encodeByWriter(this, result, serializer, value);
      return result.toString();
    }finally {
      result.w12();
    }
  };
  protoOf(Json).u12 = function (deserializer, string) {
    var lexer = StringJsonLexer_0(this, string);
    var input = new StreamingJsonDecoder(this, WriteMode_OBJ_getInstance(), lexer, deserializer.qi(), null);
    var result = input.ql(deserializer);
    lexer.j13();
    return result;
  };
  function Json_0(from, builderAction) {
    from = from === VOID ? Default_getInstance() : from;
    var builder = new JsonBuilder(from);
    builderAction(builder);
    var conf = builder.c14();
    return new JsonImpl(conf, builder.b14_1);
  }
  function JsonBuilder(json) {
    this.k13_1 = json.q12_1.d14_1;
    this.l13_1 = json.q12_1.i14_1;
    this.m13_1 = json.q12_1.e14_1;
    this.n13_1 = json.q12_1.f14_1;
    this.o13_1 = json.q12_1.h14_1;
    this.p13_1 = json.q12_1.j14_1;
    this.q13_1 = json.q12_1.k14_1;
    this.r13_1 = json.q12_1.m14_1;
    this.s13_1 = json.q12_1.t14_1;
    this.t13_1 = json.q12_1.o14_1;
    this.u13_1 = json.q12_1.p14_1;
    this.v13_1 = json.q12_1.q14_1;
    this.w13_1 = json.q12_1.r14_1;
    this.x13_1 = json.q12_1.s14_1;
    this.y13_1 = json.q12_1.n14_1;
    this.z13_1 = json.q12_1.g14_1;
    this.a14_1 = json.q12_1.l14_1;
    this.b14_1 = json.gm();
  }
  protoOf(JsonBuilder).c14 = function () {
    if (this.a14_1) {
      // Inline function 'kotlin.require' call
      if (!(this.r13_1 === 'type')) {
        var message = 'Class discriminator should not be specified when array polymorphism is specified';
        throw IllegalArgumentException_init_$Create$(toString(message));
      }
      // Inline function 'kotlin.require' call
      if (!this.s13_1.equals(ClassDiscriminatorMode_POLYMORPHIC_getInstance())) {
        var message_0 = 'useArrayPolymorphism option can only be used if classDiscriminatorMode in a default POLYMORPHIC state.';
        throw IllegalArgumentException_init_$Create$(toString(message_0));
      }
    }
    if (!this.o13_1) {
      // Inline function 'kotlin.require' call
      if (!(this.p13_1 === '    ')) {
        var message_1 = 'Indent should not be specified when default printing mode is used';
        throw IllegalArgumentException_init_$Create$(toString(message_1));
      }
    } else if (!(this.p13_1 === '    ')) {
      var tmp3 = this.p13_1;
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
        var message_2 = 'Only whitespace, tab, newline and carriage return are allowed as pretty print symbols. Had ' + this.p13_1;
        throw IllegalArgumentException_init_$Create$(toString(message_2));
      }
    }
    return new JsonConfiguration(this.k13_1, this.m13_1, this.n13_1, this.z13_1, this.o13_1, this.l13_1, this.p13_1, this.q13_1, this.a14_1, this.r13_1, this.y13_1, this.t13_1, this.u13_1, this.v13_1, this.w13_1, this.x13_1, this.s13_1);
  };
  function validateConfiguration($this) {
    if (equals($this.gm(), EmptySerializersModule()))
      return Unit_instance;
    var collector = new PolymorphismValidator($this.q12_1.l14_1, $this.q12_1.m14_1);
    $this.gm().y11(collector);
  }
  function JsonImpl(configuration, module_0) {
    Json.call(this, configuration, module_0);
    validateConfiguration(this);
  }
  function JsonClassDiscriminator() {
  }
  function JsonNames() {
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
    this.d14_1 = encodeDefaults;
    this.e14_1 = ignoreUnknownKeys;
    this.f14_1 = isLenient;
    this.g14_1 = allowStructuredMapKeys;
    this.h14_1 = prettyPrint;
    this.i14_1 = explicitNulls;
    this.j14_1 = prettyPrintIndent;
    this.k14_1 = coerceInputValues;
    this.l14_1 = useArrayPolymorphism;
    this.m14_1 = classDiscriminator;
    this.n14_1 = allowSpecialFloatingPointValues;
    this.o14_1 = useAlternativeNames;
    this.p14_1 = namingStrategy;
    this.q14_1 = decodeEnumsCaseInsensitive;
    this.r14_1 = allowTrailingComma;
    this.s14_1 = allowComments;
    this.t14_1 = classDiscriminatorMode;
  }
  protoOf(JsonConfiguration).toString = function () {
    return 'JsonConfiguration(encodeDefaults=' + this.d14_1 + ', ignoreUnknownKeys=' + this.e14_1 + ', isLenient=' + this.f14_1 + ', ' + ('allowStructuredMapKeys=' + this.g14_1 + ', prettyPrint=' + this.h14_1 + ', explicitNulls=' + this.i14_1 + ', ') + ("prettyPrintIndent='" + this.j14_1 + "', coerceInputValues=" + this.k14_1 + ', useArrayPolymorphism=' + this.l14_1 + ', ') + ("classDiscriminator='" + this.m14_1 + "', allowSpecialFloatingPointValues=" + this.n14_1 + ', ') + ('useAlternativeNames=' + this.o14_1 + ', namingStrategy=' + toString_0(this.p14_1) + ', decodeEnumsCaseInsensitive=' + this.q14_1 + ', ') + ('allowTrailingComma=' + this.r14_1 + ', allowComments=' + this.s14_1 + ', classDiscriminatorMode=' + this.t14_1.toString() + ')');
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
  function ClassDiscriminatorMode_NONE_getInstance() {
    ClassDiscriminatorMode_initEntries();
    return ClassDiscriminatorMode_NONE_instance;
  }
  function ClassDiscriminatorMode_POLYMORPHIC_getInstance() {
    ClassDiscriminatorMode_initEntries();
    return ClassDiscriminatorMode_POLYMORPHIC_instance;
  }
  function JsonDecoder() {
  }
  function get_jsonUnquotedLiteralDescriptor() {
    _init_properties_JsonElement_kt__7cbdc2();
    return jsonUnquotedLiteralDescriptor;
  }
  var jsonUnquotedLiteralDescriptor;
  function Companion() {
  }
  var Companion_instance;
  function Companion_getInstance_3() {
    return Companion_instance;
  }
  function JsonObject$toString$lambda(_destruct__k2r9zo) {
    // Inline function 'kotlin.collections.component1' call
    var k = _destruct__k2r9zo.r1();
    // Inline function 'kotlin.collections.component2' call
    var v = _destruct__k2r9zo.s1();
    // Inline function 'kotlin.text.buildString' call
    // Inline function 'kotlin.apply' call
    var this_0 = StringBuilder_init_$Create$();
    printQuoted(this_0, k);
    this_0.g7(_Char___init__impl__6a9atx(58));
    this_0.e7(v);
    return this_0.toString();
  }
  function JsonObject(content) {
    JsonElement.call(this);
    this.w14_1 = content;
  }
  protoOf(JsonObject).equals = function (other) {
    return equals(this.w14_1, other);
  };
  protoOf(JsonObject).hashCode = function () {
    return hashCode(this.w14_1);
  };
  protoOf(JsonObject).toString = function () {
    var tmp = this.w14_1.y1();
    return joinToString(tmp, ',', '{', '}', VOID, VOID, JsonObject$toString$lambda);
  };
  protoOf(JsonObject).x14 = function (key) {
    return this.w14_1.t1(key);
  };
  protoOf(JsonObject).t1 = function (key) {
    if (!(!(key == null) ? typeof key === 'string' : false))
      return false;
    return this.x14((!(key == null) ? typeof key === 'string' : false) ? key : THROW_CCE());
  };
  protoOf(JsonObject).vb = function (key) {
    return this.w14_1.v1(key);
  };
  protoOf(JsonObject).v1 = function (key) {
    if (!(!(key == null) ? typeof key === 'string' : false))
      return null;
    return this.vb((!(key == null) ? typeof key === 'string' : false) ? key : THROW_CCE());
  };
  protoOf(JsonObject).p = function () {
    return this.w14_1.p();
  };
  protoOf(JsonObject).y1 = function () {
    return this.w14_1.y1();
  };
  protoOf(JsonObject).w1 = function () {
    return this.w14_1.w1();
  };
  protoOf(JsonObject).j = function () {
    return this.w14_1.j();
  };
  protoOf(JsonObject).x1 = function () {
    return this.w14_1.x1();
  };
  function Companion_0() {
  }
  var Companion_instance_0;
  function Companion_getInstance_4() {
    return Companion_instance_0;
  }
  function JsonElement() {
  }
  function Companion_1() {
  }
  var Companion_instance_1;
  function Companion_getInstance_5() {
    return Companion_instance_1;
  }
  function JsonArray(content) {
    JsonElement.call(this);
    this.y14_1 = content;
  }
  protoOf(JsonArray).equals = function (other) {
    return equals(this.y14_1, other);
  };
  protoOf(JsonArray).hashCode = function () {
    return hashCode(this.y14_1);
  };
  protoOf(JsonArray).toString = function () {
    return joinToString(this.y14_1, ',', '[', ']');
  };
  protoOf(JsonArray).z14 = function (element) {
    return this.y14_1.p1(element);
  };
  protoOf(JsonArray).p1 = function (element) {
    if (!(element instanceof JsonElement))
      return false;
    return this.z14(element instanceof JsonElement ? element : THROW_CCE());
  };
  protoOf(JsonArray).k = function (index) {
    return this.y14_1.k(index);
  };
  protoOf(JsonArray).p = function () {
    return this.y14_1.p();
  };
  protoOf(JsonArray).g = function () {
    return this.y14_1.g();
  };
  protoOf(JsonArray).j = function () {
    return this.y14_1.j();
  };
  function Companion_2() {
  }
  var Companion_instance_2;
  function Companion_getInstance_6() {
    return Companion_instance_2;
  }
  function JsonPrimitive() {
    JsonElement.call(this);
  }
  protoOf(JsonPrimitive).toString = function () {
    return this.a15();
  };
  function JsonPrimitive_0(value) {
    _init_properties_JsonElement_kt__7cbdc2();
    if (value == null)
      return JsonNull_getInstance();
    return new JsonLiteral(value, false);
  }
  function JsonNull() {
    JsonNull_instance = this;
    JsonPrimitive.call(this);
    this.b15_1 = 'null';
  }
  protoOf(JsonNull).a15 = function () {
    return this.b15_1;
  };
  protoOf(JsonNull).c15 = function () {
    return JsonNullSerializer_getInstance();
  };
  protoOf(JsonNull).fu = function (typeParamsSerializers) {
    return this.c15();
  };
  var JsonNull_instance;
  function JsonNull_getInstance() {
    if (JsonNull_instance == null)
      new JsonNull();
    return JsonNull_instance;
  }
  function JsonLiteral(body, isString, coerceToInlineType) {
    coerceToInlineType = coerceToInlineType === VOID ? null : coerceToInlineType;
    JsonPrimitive.call(this);
    this.d15_1 = isString;
    this.e15_1 = coerceToInlineType;
    this.f15_1 = toString(body);
    if (!(this.e15_1 == null)) {
      // Inline function 'kotlin.require' call
      // Inline function 'kotlin.require' call
      if (!this.e15_1.wj()) {
        var message = 'Failed requirement.';
        throw IllegalArgumentException_init_$Create$(toString(message));
      }
    }
  }
  protoOf(JsonLiteral).a15 = function () {
    return this.f15_1;
  };
  protoOf(JsonLiteral).toString = function () {
    var tmp;
    if (this.d15_1) {
      // Inline function 'kotlin.text.buildString' call
      // Inline function 'kotlin.apply' call
      var this_0 = StringBuilder_init_$Create$();
      printQuoted(this_0, this.f15_1);
      tmp = this_0.toString();
    } else {
      tmp = this.f15_1;
    }
    return tmp;
  };
  protoOf(JsonLiteral).equals = function (other) {
    if (this === other)
      return true;
    if (other == null || !getKClassFromExpression(this).equals(getKClassFromExpression(other)))
      return false;
    if (!(other instanceof JsonLiteral))
      THROW_CCE();
    if (!(this.d15_1 === other.d15_1))
      return false;
    if (!(this.f15_1 === other.f15_1))
      return false;
    return true;
  };
  protoOf(JsonLiteral).hashCode = function () {
    var result = getBooleanHashCode(this.d15_1);
    result = imul(31, result) + getStringHashCode(this.f15_1) | 0;
    return result;
  };
  function JsonPrimitive_1(value) {
    _init_properties_JsonElement_kt__7cbdc2();
    if (value == null)
      return JsonNull_getInstance();
    return new JsonLiteral(value, true);
  }
  function get_booleanOrNull(_this__u8e3s4) {
    _init_properties_JsonElement_kt__7cbdc2();
    return toBooleanStrictOrNull_0(_this__u8e3s4.a15());
  }
  function get_int(_this__u8e3s4) {
    _init_properties_JsonElement_kt__7cbdc2();
    // Inline function 'kotlinx.serialization.json.mapExceptions' call
    var tmp;
    try {
      tmp = (new StringJsonLexer(_this__u8e3s4.a15())).g15();
    } catch ($p) {
      var tmp_0;
      if ($p instanceof JsonDecodingException) {
        var e = $p;
        throw NumberFormatException_init_$Create$(e.message);
      } else {
        throw $p;
      }
    }
    var result = tmp;
    // Inline function 'kotlin.ranges.contains' call
    var this_0 = numberRangeToNumber(-2147483648, 2147483647);
    if (!contains(isInterface(this_0, ClosedRange) ? this_0 : THROW_CCE(), result))
      throw NumberFormatException_init_$Create$(_this__u8e3s4.a15() + ' is not an Int');
    return result.a1();
  }
  function get_long(_this__u8e3s4) {
    _init_properties_JsonElement_kt__7cbdc2();
    // Inline function 'kotlinx.serialization.json.mapExceptions' call
    var tmp;
    try {
      tmp = (new StringJsonLexer(_this__u8e3s4.a15())).g15();
    } catch ($p) {
      var tmp_0;
      if ($p instanceof JsonDecodingException) {
        var e = $p;
        throw NumberFormatException_init_$Create$(e.message);
      } else {
        throw $p;
      }
    }
    return tmp;
  }
  function get_float(_this__u8e3s4) {
    _init_properties_JsonElement_kt__7cbdc2();
    // Inline function 'kotlin.text.toFloat' call
    var this_0 = _this__u8e3s4.a15();
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    return toDouble(this_0);
  }
  function get_double(_this__u8e3s4) {
    _init_properties_JsonElement_kt__7cbdc2();
    return toDouble(_this__u8e3s4.a15());
  }
  function get_contentOrNull(_this__u8e3s4) {
    _init_properties_JsonElement_kt__7cbdc2();
    var tmp;
    if (_this__u8e3s4 instanceof JsonNull) {
      tmp = null;
    } else {
      tmp = _this__u8e3s4.a15();
    }
    return tmp;
  }
  function get_jsonPrimitive(_this__u8e3s4) {
    _init_properties_JsonElement_kt__7cbdc2();
    var tmp0_elvis_lhs = _this__u8e3s4 instanceof JsonPrimitive ? _this__u8e3s4 : null;
    var tmp;
    if (tmp0_elvis_lhs == null) {
      error(_this__u8e3s4, 'JsonPrimitive');
    } else {
      tmp = tmp0_elvis_lhs;
    }
    return tmp;
  }
  function error(_this__u8e3s4, element) {
    _init_properties_JsonElement_kt__7cbdc2();
    throw IllegalArgumentException_init_$Create$('Element ' + toString(getKClassFromExpression(_this__u8e3s4)) + ' is not a ' + element);
  }
  var properties_initialized_JsonElement_kt_abxy8s;
  function _init_properties_JsonElement_kt__7cbdc2() {
    if (!properties_initialized_JsonElement_kt_abxy8s) {
      properties_initialized_JsonElement_kt_abxy8s = true;
      jsonUnquotedLiteralDescriptor = InlinePrimitiveDescriptor('kotlinx.serialization.json.JsonUnquotedLiteral', serializer(StringCompanionObject_instance));
    }
  }
  function JsonObjectBuilder() {
    var tmp = this;
    // Inline function 'kotlin.collections.linkedMapOf' call
    tmp.h15_1 = LinkedHashMap_init_$Create$();
  }
  protoOf(JsonObjectBuilder).i15 = function (key, element) {
    return this.h15_1.c2(key, element);
  };
  protoOf(JsonObjectBuilder).c14 = function () {
    return new JsonObject(this.h15_1);
  };
  function put(_this__u8e3s4, key, value) {
    return _this__u8e3s4.i15(key, JsonPrimitive_1(value));
  }
  function put_0(_this__u8e3s4, key, value) {
    return _this__u8e3s4.i15(key, JsonPrimitive_0(value));
  }
  function JsonElementSerializer$descriptor$lambda($this$buildSerialDescriptor) {
    $this$buildSerialDescriptor.bj('JsonPrimitive', defer(JsonElementSerializer$descriptor$lambda$lambda));
    $this$buildSerialDescriptor.bj('JsonNull', defer(JsonElementSerializer$descriptor$lambda$lambda_0));
    $this$buildSerialDescriptor.bj('JsonLiteral', defer(JsonElementSerializer$descriptor$lambda$lambda_1));
    $this$buildSerialDescriptor.bj('JsonObject', defer(JsonElementSerializer$descriptor$lambda$lambda_2));
    $this$buildSerialDescriptor.bj('JsonArray', defer(JsonElementSerializer$descriptor$lambda$lambda_3));
    return Unit_instance;
  }
  function JsonElementSerializer$descriptor$lambda$lambda() {
    return JsonPrimitiveSerializer_getInstance().j15_1;
  }
  function JsonElementSerializer$descriptor$lambda$lambda_0() {
    return JsonNullSerializer_getInstance().k15_1;
  }
  function JsonElementSerializer$descriptor$lambda$lambda_1() {
    return JsonLiteralSerializer_getInstance().l15_1;
  }
  function JsonElementSerializer$descriptor$lambda$lambda_2() {
    return JsonObjectSerializer_getInstance().m15_1;
  }
  function JsonElementSerializer$descriptor$lambda$lambda_3() {
    return JsonArraySerializer_getInstance().n15_1;
  }
  function JsonElementSerializer() {
    JsonElementSerializer_instance = this;
    var tmp = this;
    var tmp_0 = SEALED_getInstance();
    tmp.o15_1 = buildSerialDescriptor('kotlinx.serialization.json.JsonElement', tmp_0, [], JsonElementSerializer$descriptor$lambda);
  }
  protoOf(JsonElementSerializer).qi = function () {
    return this.o15_1;
  };
  protoOf(JsonElementSerializer).p15 = function (encoder, value) {
    verify(encoder);
    if (value instanceof JsonPrimitive) {
      encoder.jn(JsonPrimitiveSerializer_getInstance(), value);
    } else {
      if (value instanceof JsonObject) {
        encoder.jn(JsonObjectSerializer_getInstance(), value);
      } else {
        if (value instanceof JsonArray) {
          encoder.jn(JsonArraySerializer_getInstance(), value);
        } else {
          noWhenBranchMatchedException();
        }
      }
    }
  };
  protoOf(JsonElementSerializer).ri = function (encoder, value) {
    return this.p15(encoder, value instanceof JsonElement ? value : THROW_CCE());
  };
  protoOf(JsonElementSerializer).si = function (decoder) {
    var input = asJsonDecoder(decoder);
    return input.v14();
  };
  var JsonElementSerializer_instance;
  function JsonElementSerializer_getInstance() {
    if (JsonElementSerializer_instance == null)
      new JsonElementSerializer();
    return JsonElementSerializer_instance;
  }
  function JsonObjectDescriptor() {
    JsonObjectDescriptor_instance = this;
    this.q15_1 = MapSerializer(serializer(StringCompanionObject_instance), JsonElementSerializer_getInstance()).qi();
    this.r15_1 = 'kotlinx.serialization.json.JsonObject';
  }
  protoOf(JsonObjectDescriptor).uj = function () {
    return this.r15_1;
  };
  protoOf(JsonObjectDescriptor).zj = function (index) {
    return this.q15_1.zj(index);
  };
  protoOf(JsonObjectDescriptor).ak = function (name) {
    return this.q15_1.ak(name);
  };
  protoOf(JsonObjectDescriptor).bk = function (index) {
    return this.q15_1.bk(index);
  };
  protoOf(JsonObjectDescriptor).ck = function (index) {
    return this.q15_1.ck(index);
  };
  protoOf(JsonObjectDescriptor).dk = function (index) {
    return this.q15_1.dk(index);
  };
  protoOf(JsonObjectDescriptor).vj = function () {
    return this.q15_1.vj();
  };
  protoOf(JsonObjectDescriptor).qj = function () {
    return this.q15_1.qj();
  };
  protoOf(JsonObjectDescriptor).wj = function () {
    return this.q15_1.wj();
  };
  protoOf(JsonObjectDescriptor).xj = function () {
    return this.q15_1.xj();
  };
  protoOf(JsonObjectDescriptor).yj = function () {
    return this.q15_1.yj();
  };
  var JsonObjectDescriptor_instance;
  function JsonObjectDescriptor_getInstance() {
    if (JsonObjectDescriptor_instance == null)
      new JsonObjectDescriptor();
    return JsonObjectDescriptor_instance;
  }
  function JsonObjectSerializer() {
    JsonObjectSerializer_instance = this;
    this.m15_1 = JsonObjectDescriptor_getInstance();
  }
  protoOf(JsonObjectSerializer).qi = function () {
    return this.m15_1;
  };
  protoOf(JsonObjectSerializer).s15 = function (encoder, value) {
    verify(encoder);
    MapSerializer(serializer(StringCompanionObject_instance), JsonElementSerializer_getInstance()).ri(encoder, value);
  };
  protoOf(JsonObjectSerializer).ri = function (encoder, value) {
    return this.s15(encoder, value instanceof JsonObject ? value : THROW_CCE());
  };
  protoOf(JsonObjectSerializer).si = function (decoder) {
    verify_0(decoder);
    return new JsonObject(MapSerializer(serializer(StringCompanionObject_instance), JsonElementSerializer_getInstance()).si(decoder));
  };
  var JsonObjectSerializer_instance;
  function JsonObjectSerializer_getInstance() {
    if (JsonObjectSerializer_instance == null)
      new JsonObjectSerializer();
    return JsonObjectSerializer_instance;
  }
  function JsonArrayDescriptor() {
    JsonArrayDescriptor_instance = this;
    this.t15_1 = ListSerializer(JsonElementSerializer_getInstance()).qi();
    this.u15_1 = 'kotlinx.serialization.json.JsonArray';
  }
  protoOf(JsonArrayDescriptor).uj = function () {
    return this.u15_1;
  };
  protoOf(JsonArrayDescriptor).zj = function (index) {
    return this.t15_1.zj(index);
  };
  protoOf(JsonArrayDescriptor).ak = function (name) {
    return this.t15_1.ak(name);
  };
  protoOf(JsonArrayDescriptor).bk = function (index) {
    return this.t15_1.bk(index);
  };
  protoOf(JsonArrayDescriptor).ck = function (index) {
    return this.t15_1.ck(index);
  };
  protoOf(JsonArrayDescriptor).dk = function (index) {
    return this.t15_1.dk(index);
  };
  protoOf(JsonArrayDescriptor).vj = function () {
    return this.t15_1.vj();
  };
  protoOf(JsonArrayDescriptor).qj = function () {
    return this.t15_1.qj();
  };
  protoOf(JsonArrayDescriptor).wj = function () {
    return this.t15_1.wj();
  };
  protoOf(JsonArrayDescriptor).xj = function () {
    return this.t15_1.xj();
  };
  protoOf(JsonArrayDescriptor).yj = function () {
    return this.t15_1.yj();
  };
  var JsonArrayDescriptor_instance;
  function JsonArrayDescriptor_getInstance() {
    if (JsonArrayDescriptor_instance == null)
      new JsonArrayDescriptor();
    return JsonArrayDescriptor_instance;
  }
  function JsonArraySerializer() {
    JsonArraySerializer_instance = this;
    this.n15_1 = JsonArrayDescriptor_getInstance();
  }
  protoOf(JsonArraySerializer).qi = function () {
    return this.n15_1;
  };
  protoOf(JsonArraySerializer).v15 = function (encoder, value) {
    verify(encoder);
    ListSerializer(JsonElementSerializer_getInstance()).ri(encoder, value);
  };
  protoOf(JsonArraySerializer).ri = function (encoder, value) {
    return this.v15(encoder, value instanceof JsonArray ? value : THROW_CCE());
  };
  protoOf(JsonArraySerializer).si = function (decoder) {
    verify_0(decoder);
    return new JsonArray(ListSerializer(JsonElementSerializer_getInstance()).si(decoder));
  };
  var JsonArraySerializer_instance;
  function JsonArraySerializer_getInstance() {
    if (JsonArraySerializer_instance == null)
      new JsonArraySerializer();
    return JsonArraySerializer_instance;
  }
  function JsonPrimitiveSerializer() {
    JsonPrimitiveSerializer_instance = this;
    this.j15_1 = buildSerialDescriptor('kotlinx.serialization.json.JsonPrimitive', STRING_getInstance(), []);
  }
  protoOf(JsonPrimitiveSerializer).qi = function () {
    return this.j15_1;
  };
  protoOf(JsonPrimitiveSerializer).w15 = function (encoder, value) {
    verify(encoder);
    var tmp;
    if (value instanceof JsonNull) {
      encoder.jn(JsonNullSerializer_getInstance(), JsonNull_getInstance());
      tmp = Unit_instance;
    } else {
      var tmp_0 = JsonLiteralSerializer_getInstance();
      encoder.jn(tmp_0, value instanceof JsonLiteral ? value : THROW_CCE());
      tmp = Unit_instance;
    }
    return tmp;
  };
  protoOf(JsonPrimitiveSerializer).ri = function (encoder, value) {
    return this.w15(encoder, value instanceof JsonPrimitive ? value : THROW_CCE());
  };
  protoOf(JsonPrimitiveSerializer).si = function (decoder) {
    var result = asJsonDecoder(decoder).v14();
    if (!(result instanceof JsonPrimitive))
      throw JsonDecodingException_0(-1, 'Unexpected JSON element, expected JsonPrimitive, had ' + toString(getKClassFromExpression(result)), toString(result));
    return result;
  };
  var JsonPrimitiveSerializer_instance;
  function JsonPrimitiveSerializer_getInstance() {
    if (JsonPrimitiveSerializer_instance == null)
      new JsonPrimitiveSerializer();
    return JsonPrimitiveSerializer_instance;
  }
  function JsonNullSerializer() {
    JsonNullSerializer_instance = this;
    this.k15_1 = buildSerialDescriptor('kotlinx.serialization.json.JsonNull', ENUM_getInstance(), []);
  }
  protoOf(JsonNullSerializer).qi = function () {
    return this.k15_1;
  };
  protoOf(JsonNullSerializer).x15 = function (encoder, value) {
    verify(encoder);
    encoder.mm();
  };
  protoOf(JsonNullSerializer).ri = function (encoder, value) {
    return this.x15(encoder, value instanceof JsonNull ? value : THROW_CCE());
  };
  protoOf(JsonNullSerializer).si = function (decoder) {
    verify_0(decoder);
    if (decoder.cl()) {
      throw new JsonDecodingException("Expected 'null' literal");
    }
    decoder.dl();
    return JsonNull_getInstance();
  };
  var JsonNullSerializer_instance;
  function JsonNullSerializer_getInstance() {
    if (JsonNullSerializer_instance == null)
      new JsonNullSerializer();
    return JsonNullSerializer_instance;
  }
  function defer(deferred) {
    return new defer$1(deferred);
  }
  function JsonLiteralSerializer() {
    JsonLiteralSerializer_instance = this;
    this.l15_1 = PrimitiveSerialDescriptor('kotlinx.serialization.json.JsonLiteral', STRING_getInstance());
  }
  protoOf(JsonLiteralSerializer).qi = function () {
    return this.l15_1;
  };
  protoOf(JsonLiteralSerializer).y15 = function (encoder, value) {
    verify(encoder);
    if (value.d15_1) {
      return encoder.vm(value.f15_1);
    }
    if (!(value.e15_1 == null)) {
      return encoder.xm(value.e15_1).vm(value.f15_1);
    }
    var tmp0_safe_receiver = toLongOrNull(value.f15_1);
    if (tmp0_safe_receiver == null)
      null;
    else {
      // Inline function 'kotlin.let' call
      return encoder.rm(tmp0_safe_receiver);
    }
    var tmp1_safe_receiver = toULongOrNull(value.f15_1);
    var tmp = tmp1_safe_receiver;
    if ((tmp == null ? null : new ULong(tmp)) == null)
      null;
    else {
      var tmp_0 = tmp1_safe_receiver;
      // Inline function 'kotlin.let' call
      var it = (tmp_0 == null ? null : new ULong(tmp_0)).ai_1;
      var tmp_1 = encoder.xm(serializer_0(Companion_getInstance()).qi());
      // Inline function 'kotlin.ULong.toLong' call
      var tmp$ret$1 = _ULong___get_data__impl__fggpzb(it);
      tmp_1.rm(tmp$ret$1);
      return Unit_instance;
    }
    var tmp2_safe_receiver = toDoubleOrNull(value.f15_1);
    if (tmp2_safe_receiver == null)
      null;
    else {
      // Inline function 'kotlin.let' call
      return encoder.tm(tmp2_safe_receiver);
    }
    var tmp3_safe_receiver = toBooleanStrictOrNull(value.f15_1);
    if (tmp3_safe_receiver == null)
      null;
    else {
      // Inline function 'kotlin.let' call
      return encoder.nm(tmp3_safe_receiver);
    }
    encoder.vm(value.f15_1);
  };
  protoOf(JsonLiteralSerializer).ri = function (encoder, value) {
    return this.y15(encoder, value instanceof JsonLiteral ? value : THROW_CCE());
  };
  protoOf(JsonLiteralSerializer).si = function (decoder) {
    var result = asJsonDecoder(decoder).v14();
    if (!(result instanceof JsonLiteral))
      throw JsonDecodingException_0(-1, 'Unexpected JSON element, expected JsonLiteral, had ' + toString(getKClassFromExpression(result)), toString(result));
    return result;
  };
  var JsonLiteralSerializer_instance;
  function JsonLiteralSerializer_getInstance() {
    if (JsonLiteralSerializer_instance == null)
      new JsonLiteralSerializer();
    return JsonLiteralSerializer_instance;
  }
  function verify(encoder) {
    asJsonEncoder(encoder);
  }
  function asJsonDecoder(_this__u8e3s4) {
    var tmp0_elvis_lhs = isInterface(_this__u8e3s4, JsonDecoder) ? _this__u8e3s4 : null;
    var tmp;
    if (tmp0_elvis_lhs == null) {
      throw IllegalStateException_init_$Create$('This serializer can be used only with Json format.' + ('Expected Decoder to be JsonDecoder, got ' + toString(getKClassFromExpression(_this__u8e3s4))));
    } else {
      tmp = tmp0_elvis_lhs;
    }
    return tmp;
  }
  function verify_0(decoder) {
    asJsonDecoder(decoder);
  }
  function asJsonEncoder(_this__u8e3s4) {
    var tmp0_elvis_lhs = isInterface(_this__u8e3s4, JsonEncoder) ? _this__u8e3s4 : null;
    var tmp;
    if (tmp0_elvis_lhs == null) {
      throw IllegalStateException_init_$Create$('This serializer can be used only with Json format.' + ('Expected Encoder to be JsonEncoder, got ' + toString(getKClassFromExpression(_this__u8e3s4))));
    } else {
      tmp = tmp0_elvis_lhs;
    }
    return tmp;
  }
  function _get_original__l7ku1m($this) {
    var tmp0 = $this.z15_1;
    // Inline function 'kotlin.getValue' call
    original$factory();
    return tmp0.s1();
  }
  function defer$1($deferred) {
    this.z15_1 = lazy($deferred);
  }
  protoOf(defer$1).uj = function () {
    return _get_original__l7ku1m(this).uj();
  };
  protoOf(defer$1).vj = function () {
    return _get_original__l7ku1m(this).vj();
  };
  protoOf(defer$1).xj = function () {
    return _get_original__l7ku1m(this).xj();
  };
  protoOf(defer$1).zj = function (index) {
    return _get_original__l7ku1m(this).zj(index);
  };
  protoOf(defer$1).ak = function (name) {
    return _get_original__l7ku1m(this).ak(name);
  };
  protoOf(defer$1).bk = function (index) {
    return _get_original__l7ku1m(this).bk(index);
  };
  protoOf(defer$1).ck = function (index) {
    return _get_original__l7ku1m(this).ck(index);
  };
  protoOf(defer$1).dk = function (index) {
    return _get_original__l7ku1m(this).dk(index);
  };
  function original$factory() {
    return getPropertyCallableRef('original', 1, KProperty1, function (receiver) {
      return _get_original__l7ku1m(receiver);
    }, null);
  }
  function JsonEncoder() {
  }
  function Composer(writer) {
    this.a16_1 = writer;
    this.b16_1 = true;
  }
  protoOf(Composer).c16 = function () {
    this.b16_1 = true;
  };
  protoOf(Composer).d16 = function () {
    return Unit_instance;
  };
  protoOf(Composer).e16 = function () {
    this.b16_1 = false;
  };
  protoOf(Composer).f16 = function () {
    this.b16_1 = false;
  };
  protoOf(Composer).g16 = function () {
    return Unit_instance;
  };
  protoOf(Composer).h16 = function (v) {
    return this.a16_1.i16(v);
  };
  protoOf(Composer).j16 = function (v) {
    return this.a16_1.k16(v);
  };
  protoOf(Composer).l16 = function (v) {
    return this.a16_1.k16(v.toString());
  };
  protoOf(Composer).m16 = function (v) {
    return this.a16_1.k16(v.toString());
  };
  protoOf(Composer).n16 = function (v) {
    return this.a16_1.o16(toLong(v));
  };
  protoOf(Composer).p16 = function (v) {
    return this.a16_1.o16(toLong(v));
  };
  protoOf(Composer).q16 = function (v) {
    return this.a16_1.o16(toLong(v));
  };
  protoOf(Composer).r16 = function (v) {
    return this.a16_1.o16(v);
  };
  protoOf(Composer).s16 = function (v) {
    return this.a16_1.k16(v.toString());
  };
  protoOf(Composer).t16 = function (value) {
    return this.a16_1.u16(value);
  };
  function Composer_0(sb, json) {
    return json.q12_1.h14_1 ? new ComposerWithPrettyPrint(sb, json) : new Composer(sb);
  }
  function ComposerForUnsignedNumbers(writer, forceQuoting) {
    Composer.call(this, writer);
    this.x16_1 = forceQuoting;
  }
  protoOf(ComposerForUnsignedNumbers).q16 = function (v) {
    if (this.x16_1) {
      // Inline function 'kotlin.toUInt' call
      var tmp$ret$0 = _UInt___init__impl__l7qpdl(v);
      this.t16(UInt__toString_impl_dbgl21(tmp$ret$0));
    } else {
      // Inline function 'kotlin.toUInt' call
      var tmp$ret$1 = _UInt___init__impl__l7qpdl(v);
      this.j16(UInt__toString_impl_dbgl21(tmp$ret$1));
    }
  };
  protoOf(ComposerForUnsignedNumbers).r16 = function (v) {
    if (this.x16_1) {
      // Inline function 'kotlin.toULong' call
      var tmp$ret$0 = _ULong___init__impl__c78o9k(v);
      this.t16(ULong__toString_impl_f9au7k(tmp$ret$0));
    } else {
      // Inline function 'kotlin.toULong' call
      var tmp$ret$1 = _ULong___init__impl__c78o9k(v);
      this.j16(ULong__toString_impl_f9au7k(tmp$ret$1));
    }
  };
  protoOf(ComposerForUnsignedNumbers).n16 = function (v) {
    if (this.x16_1) {
      // Inline function 'kotlin.toUByte' call
      var tmp$ret$0 = _UByte___init__impl__g9hnc4(v);
      this.t16(UByte__toString_impl_v72jg(tmp$ret$0));
    } else {
      // Inline function 'kotlin.toUByte' call
      var tmp$ret$1 = _UByte___init__impl__g9hnc4(v);
      this.j16(UByte__toString_impl_v72jg(tmp$ret$1));
    }
  };
  protoOf(ComposerForUnsignedNumbers).p16 = function (v) {
    if (this.x16_1) {
      // Inline function 'kotlin.toUShort' call
      var tmp$ret$0 = _UShort___init__impl__jigrne(v);
      this.t16(UShort__toString_impl_edaoee(tmp$ret$0));
    } else {
      // Inline function 'kotlin.toUShort' call
      var tmp$ret$1 = _UShort___init__impl__jigrne(v);
      this.j16(UShort__toString_impl_edaoee(tmp$ret$1));
    }
  };
  function ComposerForUnquotedLiterals(writer, forceQuoting) {
    Composer.call(this, writer);
    this.a17_1 = forceQuoting;
  }
  protoOf(ComposerForUnquotedLiterals).t16 = function (value) {
    if (this.a17_1) {
      protoOf(Composer).t16.call(this, value);
    } else {
      protoOf(Composer).j16.call(this, value);
    }
  };
  function ComposerWithPrettyPrint(writer, json) {
    Composer.call(this, writer);
    this.d17_1 = json;
    this.e17_1 = 0;
  }
  protoOf(ComposerWithPrettyPrint).c16 = function () {
    this.b16_1 = true;
    this.e17_1 = this.e17_1 + 1 | 0;
  };
  protoOf(ComposerWithPrettyPrint).d16 = function () {
    this.e17_1 = this.e17_1 - 1 | 0;
  };
  protoOf(ComposerWithPrettyPrint).e16 = function () {
    this.b16_1 = false;
    this.j16('\n');
    // Inline function 'kotlin.repeat' call
    var times = this.e17_1;
    var inductionVariable = 0;
    if (inductionVariable < times)
      do {
        var index = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        this.j16(this.d17_1.q12_1.j14_1);
      }
       while (inductionVariable < times);
  };
  protoOf(ComposerWithPrettyPrint).f16 = function () {
    if (this.b16_1)
      this.b16_1 = false;
    else {
      this.e16();
    }
  };
  protoOf(ComposerWithPrettyPrint).g16 = function () {
    this.h16(_Char___init__impl__6a9atx(32));
  };
  function readIfAbsent($this, descriptor, index) {
    $this.g17_1 = (!descriptor.dk(index) && descriptor.ck(index).qj());
    return $this.g17_1;
  }
  function JsonElementMarker$readIfAbsent$ref($boundThis) {
    var l = function (p0, p1) {
      return readIfAbsent($boundThis, p0, p1);
    };
    l.callableName = 'readIfAbsent';
    return l;
  }
  function JsonElementMarker(descriptor) {
    var tmp = this;
    tmp.f17_1 = new ElementMarker(descriptor, JsonElementMarker$readIfAbsent$ref(this));
    this.g17_1 = false;
  }
  protoOf(JsonElementMarker).h17 = function (index) {
    this.f17_1.xr(index);
  };
  protoOf(JsonElementMarker).i17 = function () {
    return this.f17_1.yr();
  };
  function invalidTrailingComma(_this__u8e3s4, entity) {
    entity = entity === VOID ? 'object' : entity;
    _this__u8e3s4.j17('Trailing comma before the end of JSON ' + entity, _this__u8e3s4.f13_1 - 1 | 0, "Trailing commas are non-complaint JSON and not allowed by default. Use 'allowTrailingCommas = true' in 'Json {}' builder to support them.");
  }
  function throwInvalidFloatingPointDecoded(_this__u8e3s4, result) {
    _this__u8e3s4.k17('Unexpected special floating-point value ' + toString(result) + '. By default, ' + 'non-finite floating point values are prohibited because they do not conform JSON specification', VOID, "It is possible to deserialize them using 'JsonBuilder.allowSpecialFloatingPointValues = true'");
  }
  function JsonEncodingException(message) {
    JsonException.call(this, message);
    captureStack(this, JsonEncodingException);
  }
  function InvalidKeyKindException(keyDescriptor) {
    return new JsonEncodingException("Value of type '" + keyDescriptor.uj() + "' can't be used in JSON as a key in the map. " + ("It should have either primitive or enum kind, but its kind is '" + keyDescriptor.vj().toString() + "'.\n") + "Use 'allowStructuredMapKeys = true' in 'Json {}' builder to convert such maps to [key1, value1, key2, value2,...] arrays.");
  }
  function JsonDecodingException(message) {
    JsonException.call(this, message);
    captureStack(this, JsonDecodingException);
  }
  function JsonDecodingException_0(offset, message, input) {
    return JsonDecodingException_1(offset, message + '\nJSON input: ' + toString(minify(input, offset)));
  }
  function InvalidFloatingPointDecoded(value, key, output) {
    return JsonDecodingException_1(-1, unexpectedFpErrorMessage(value, key, output));
  }
  function UnknownKeyException(key, input) {
    return JsonDecodingException_1(-1, "Encountered an unknown key '" + key + "'.\n" + "Use 'ignoreUnknownKeys = true' in 'Json {}' builder to ignore unknown keys.\n" + ('Current input: ' + toString(minify(input))));
  }
  function InvalidFloatingPointEncoded(value, output) {
    return new JsonEncodingException('Unexpected special floating-point value ' + toString(value) + '. By default, ' + 'non-finite floating point values are prohibited because they do not conform JSON specification. ' + "It is possible to deserialize them using 'JsonBuilder.allowSpecialFloatingPointValues = true'\n" + ('Current output: ' + toString(minify(output))));
  }
  function JsonException(message) {
    SerializationException_init_$Init$(message, this);
    captureStack(this, JsonException);
  }
  function unexpectedFpErrorMessage(value, key, output) {
    return 'Unexpected special floating-point value ' + toString(value) + ' with key ' + key + '. By default, ' + 'non-finite floating point values are prohibited because they do not conform JSON specification. ' + "It is possible to deserialize them using 'JsonBuilder.allowSpecialFloatingPointValues = true'\n" + ('Current output: ' + toString(minify(output)));
  }
  function JsonDecodingException_1(offset, message) {
    return new JsonDecodingException(offset >= 0 ? 'Unexpected JSON token at offset ' + offset + ': ' + message : message);
  }
  function minify(_this__u8e3s4, offset) {
    offset = offset === VOID ? -1 : offset;
    if (charSequenceLength(_this__u8e3s4) < 200)
      return _this__u8e3s4;
    if (offset === -1) {
      var start = charSequenceLength(_this__u8e3s4) - 60 | 0;
      if (start <= 0)
        return _this__u8e3s4;
      // Inline function 'kotlin.text.substring' call
      var endIndex = charSequenceLength(_this__u8e3s4);
      return '.....' + toString(charSequenceSubSequence(_this__u8e3s4, start, endIndex));
    }
    var start_0 = offset - 30 | 0;
    var end = offset + 30 | 0;
    var prefix = start_0 <= 0 ? '' : '.....';
    var suffix = end >= charSequenceLength(_this__u8e3s4) ? '' : '.....';
    var tmp4 = coerceAtLeast(start_0, 0);
    // Inline function 'kotlin.text.substring' call
    var endIndex_0 = coerceAtMost(end, charSequenceLength(_this__u8e3s4));
    return prefix + toString(charSequenceSubSequence(_this__u8e3s4, tmp4, endIndex_0)) + suffix;
  }
  function get_JsonDeserializationNamesKey() {
    _init_properties_JsonNamesMap_kt__cbbp0k();
    return JsonDeserializationNamesKey;
  }
  var JsonDeserializationNamesKey;
  function get_JsonSerializationNamesKey() {
    _init_properties_JsonNamesMap_kt__cbbp0k();
    return JsonSerializationNamesKey;
  }
  var JsonSerializationNamesKey;
  function getJsonNameIndex(_this__u8e3s4, json, name) {
    _init_properties_JsonNamesMap_kt__cbbp0k();
    if (decodeCaseInsensitive(json, _this__u8e3s4)) {
      // Inline function 'kotlin.text.lowercase' call
      // Inline function 'kotlin.js.asDynamic' call
      var tmp$ret$1 = name.toLowerCase();
      return getJsonNameIndexSlowPath(_this__u8e3s4, json, tmp$ret$1);
    }
    var strategy = namingStrategy(_this__u8e3s4, json);
    if (!(strategy == null))
      return getJsonNameIndexSlowPath(_this__u8e3s4, json, name);
    var index = _this__u8e3s4.ak(name);
    if (!(index === -3))
      return index;
    if (!json.q12_1.o14_1)
      return index;
    return getJsonNameIndexSlowPath(_this__u8e3s4, json, name);
  }
  function getJsonNameIndexOrThrow(_this__u8e3s4, json, name, suffix) {
    suffix = suffix === VOID ? '' : suffix;
    _init_properties_JsonNamesMap_kt__cbbp0k();
    var index = getJsonNameIndex(_this__u8e3s4, json, name);
    if (index === -3)
      throw SerializationException_init_$Create$(_this__u8e3s4.uj() + " does not contain element with name '" + name + "'" + suffix);
    return index;
  }
  function getJsonElementName(_this__u8e3s4, json, index) {
    _init_properties_JsonNamesMap_kt__cbbp0k();
    var strategy = namingStrategy(_this__u8e3s4, json);
    return strategy == null ? _this__u8e3s4.zj(index) : serializationNamesIndices(_this__u8e3s4, json, strategy)[index];
  }
  function namingStrategy(_this__u8e3s4, json) {
    _init_properties_JsonNamesMap_kt__cbbp0k();
    return equals(_this__u8e3s4.vj(), CLASS_getInstance()) ? json.q12_1.p14_1 : null;
  }
  function deserializationNamesMap(_this__u8e3s4, descriptor) {
    _init_properties_JsonNamesMap_kt__cbbp0k();
    var tmp = get_schemaCache(_this__u8e3s4);
    var tmp_0 = get_JsonDeserializationNamesKey();
    return tmp.m17(descriptor, tmp_0, deserializationNamesMap$lambda(descriptor, _this__u8e3s4));
  }
  function decodeCaseInsensitive(_this__u8e3s4, descriptor) {
    _init_properties_JsonNamesMap_kt__cbbp0k();
    return _this__u8e3s4.q12_1.q14_1 && equals(descriptor.vj(), ENUM_getInstance());
  }
  function getJsonNameIndexSlowPath(_this__u8e3s4, json, name) {
    _init_properties_JsonNamesMap_kt__cbbp0k();
    var tmp0_elvis_lhs = deserializationNamesMap(json, _this__u8e3s4).v1(name);
    return tmp0_elvis_lhs == null ? -3 : tmp0_elvis_lhs;
  }
  function serializationNamesIndices(_this__u8e3s4, json, strategy) {
    _init_properties_JsonNamesMap_kt__cbbp0k();
    var tmp = get_schemaCache(json);
    var tmp_0 = get_JsonSerializationNamesKey();
    return tmp.m17(_this__u8e3s4, tmp_0, serializationNamesIndices$lambda(_this__u8e3s4, strategy));
  }
  function buildDeserializationNamesMap(_this__u8e3s4, json) {
    _init_properties_JsonNamesMap_kt__cbbp0k();
    // Inline function 'kotlin.collections.mutableMapOf' call
    var builder = LinkedHashMap_init_$Create$();
    var useLowercaseEnums = decodeCaseInsensitive(json, _this__u8e3s4);
    var strategyForClasses = namingStrategy(_this__u8e3s4, json);
    var inductionVariable = 0;
    var last = _this__u8e3s4.xj();
    if (inductionVariable < last)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        // Inline function 'kotlin.collections.filterIsInstance' call
        var tmp0 = _this__u8e3s4.bk(i);
        // Inline function 'kotlin.collections.filterIsInstanceTo' call
        var destination = ArrayList_init_$Create$();
        var _iterator__ex2g4s = tmp0.g();
        while (_iterator__ex2g4s.h()) {
          var element = _iterator__ex2g4s.i();
          if (element instanceof JsonNames) {
            destination.e(element);
          }
        }
        var tmp0_safe_receiver = singleOrNull(destination);
        var tmp1_safe_receiver = tmp0_safe_receiver == null ? null : tmp0_safe_receiver.n17_1;
        if (tmp1_safe_receiver == null)
          null;
        else {
          // Inline function 'kotlin.collections.forEach' call
          var inductionVariable_0 = 0;
          var last_0 = tmp1_safe_receiver.length;
          while (inductionVariable_0 < last_0) {
            var element_0 = tmp1_safe_receiver[inductionVariable_0];
            inductionVariable_0 = inductionVariable_0 + 1 | 0;
            var tmp;
            if (useLowercaseEnums) {
              // Inline function 'kotlin.text.lowercase' call
              // Inline function 'kotlin.js.asDynamic' call
              tmp = element_0.toLowerCase();
            } else {
              tmp = element_0;
            }
            buildDeserializationNamesMap$putOrThrow(builder, _this__u8e3s4, tmp, i);
          }
        }
        var tmp_0;
        if (useLowercaseEnums) {
          // Inline function 'kotlin.text.lowercase' call
          // Inline function 'kotlin.js.asDynamic' call
          tmp_0 = _this__u8e3s4.zj(i).toLowerCase();
        } else if (!(strategyForClasses == null)) {
          tmp_0 = strategyForClasses.o17(_this__u8e3s4, i, _this__u8e3s4.zj(i));
        } else {
          tmp_0 = null;
        }
        var nameToPut = tmp_0;
        if (nameToPut == null)
          null;
        else {
          // Inline function 'kotlin.let' call
          buildDeserializationNamesMap$putOrThrow(builder, _this__u8e3s4, nameToPut, i);
        }
      }
       while (inductionVariable < last);
    // Inline function 'kotlin.collections.ifEmpty' call
    var tmp_1;
    if (builder.p()) {
      tmp_1 = emptyMap();
    } else {
      tmp_1 = builder;
    }
    return tmp_1;
  }
  function buildDeserializationNamesMap$putOrThrow(_this__u8e3s4, $this_buildDeserializationNamesMap, name, index) {
    var entity = equals($this_buildDeserializationNamesMap.vj(), ENUM_getInstance()) ? 'enum value' : 'property';
    // Inline function 'kotlin.collections.contains' call
    // Inline function 'kotlin.collections.containsKey' call
    if ((isInterface(_this__u8e3s4, KtMap) ? _this__u8e3s4 : THROW_CCE()).t1(name)) {
      throw new JsonException("The suggested name '" + name + "' for " + entity + ' ' + $this_buildDeserializationNamesMap.zj(index) + ' is already one of the names for ' + entity + ' ' + ($this_buildDeserializationNamesMap.zj(getValue(_this__u8e3s4, name)) + ' in ' + toString($this_buildDeserializationNamesMap)));
    }
    // Inline function 'kotlin.collections.set' call
    _this__u8e3s4.c2(name, index);
  }
  function deserializationNamesMap$lambda($descriptor, $this_deserializationNamesMap) {
    return function () {
      return buildDeserializationNamesMap($descriptor, $this_deserializationNamesMap);
    };
  }
  function serializationNamesIndices$lambda($this_serializationNamesIndices, $strategy) {
    return function () {
      var tmp = 0;
      var tmp_0 = $this_serializationNamesIndices.xj();
      // Inline function 'kotlin.arrayOfNulls' call
      var tmp_1 = Array(tmp_0);
      while (tmp < tmp_0) {
        var tmp_2 = tmp;
        var baseName = $this_serializationNamesIndices.zj(tmp_2);
        tmp_1[tmp_2] = $strategy.o17($this_serializationNamesIndices, tmp_2, baseName);
        tmp = tmp + 1 | 0;
      }
      return tmp_1;
    };
  }
  var properties_initialized_JsonNamesMap_kt_ljpf42;
  function _init_properties_JsonNamesMap_kt__cbbp0k() {
    if (!properties_initialized_JsonNamesMap_kt_ljpf42) {
      properties_initialized_JsonNamesMap_kt_ljpf42 = true;
      JsonDeserializationNamesKey = new Key();
      JsonSerializationNamesKey = new Key();
    }
  }
  function Tombstone() {
  }
  var Tombstone_instance;
  function Tombstone_getInstance() {
    return Tombstone_instance;
  }
  function resize($this) {
    var newSize = imul($this.r17_1, 2);
    $this.p17_1 = copyOf($this.p17_1, newSize);
    $this.q17_1 = copyOf_0($this.q17_1, newSize);
  }
  function JsonPath() {
    var tmp = this;
    // Inline function 'kotlin.arrayOfNulls' call
    tmp.p17_1 = Array(8);
    var tmp_0 = this;
    var tmp_1 = 0;
    var tmp_2 = new Int32Array(8);
    while (tmp_1 < 8) {
      tmp_2[tmp_1] = -1;
      tmp_1 = tmp_1 + 1 | 0;
    }
    tmp_0.q17_1 = tmp_2;
    this.r17_1 = -1;
  }
  protoOf(JsonPath).s17 = function (sd) {
    this.r17_1 = this.r17_1 + 1 | 0;
    var depth = this.r17_1;
    if (depth === this.p17_1.length) {
      resize(this);
    }
    this.p17_1[depth] = sd;
  };
  protoOf(JsonPath).t17 = function (index) {
    this.q17_1[this.r17_1] = index;
  };
  protoOf(JsonPath).u17 = function (key) {
    var tmp;
    if (!(this.q17_1[this.r17_1] === -2)) {
      this.r17_1 = this.r17_1 + 1 | 0;
      tmp = this.r17_1 === this.p17_1.length;
    } else {
      tmp = false;
    }
    if (tmp) {
      resize(this);
    }
    this.p17_1[this.r17_1] = key;
    this.q17_1[this.r17_1] = -2;
  };
  protoOf(JsonPath).v17 = function () {
    if (this.q17_1[this.r17_1] === -2) {
      this.p17_1[this.r17_1] = Tombstone_instance;
    }
  };
  protoOf(JsonPath).w17 = function () {
    var depth = this.r17_1;
    if (this.q17_1[depth] === -2) {
      this.q17_1[depth] = -1;
      this.r17_1 = this.r17_1 - 1 | 0;
    }
    if (!(this.r17_1 === -1)) {
      this.r17_1 = this.r17_1 - 1 | 0;
    }
  };
  protoOf(JsonPath).x17 = function () {
    // Inline function 'kotlin.text.buildString' call
    // Inline function 'kotlin.apply' call
    var this_0 = StringBuilder_init_$Create$();
    this_0.f7('$');
    // Inline function 'kotlin.repeat' call
    var times = this.r17_1 + 1 | 0;
    var inductionVariable = 0;
    if (inductionVariable < times)
      do {
        var index = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        var element = this.p17_1[index];
        if (!(element == null) ? isInterface(element, SerialDescriptor) : false) {
          if (equals(element.vj(), LIST_getInstance())) {
            if (!(this.q17_1[index] === -1)) {
              this_0.f7('[');
              this_0.na(this.q17_1[index]);
              this_0.f7(']');
            }
          } else {
            var idx = this.q17_1[index];
            if (idx >= 0) {
              this_0.f7('.');
              this_0.f7(element.zj(idx));
            }
          }
        } else {
          if (!(element === Tombstone_instance)) {
            this_0.f7('[');
            this_0.f7("'");
            this_0.e7(element);
            this_0.f7("'");
            this_0.f7(']');
          }
        }
      }
       while (inductionVariable < times);
    return this_0.toString();
  };
  protoOf(JsonPath).toString = function () {
    return this.x17();
  };
  function encodeByWriter(json, writer, serializer, value) {
    var tmp = WriteMode_OBJ_getInstance();
    // Inline function 'kotlin.arrayOfNulls' call
    var size = get_entries().j();
    var tmp$ret$0 = Array(size);
    var encoder = StreamingJsonEncoder_init_$Create$(writer, json, tmp, tmp$ret$0);
    encoder.jn(serializer, value);
  }
  function readObject($this) {
    // Inline function 'kotlinx.serialization.json.internal.JsonTreeReader.readObjectImpl' call
    var lastToken = $this.h18_1.l18(6);
    if ($this.h18_1.m18() === 4) {
      $this.h18_1.k17('Unexpected leading comma');
    }
    // Inline function 'kotlin.collections.linkedMapOf' call
    var result = LinkedHashMap_init_$Create$();
    $l$loop: while ($this.h18_1.n18()) {
      var key = $this.i18_1 ? $this.h18_1.p18() : $this.h18_1.o18();
      $this.h18_1.l18(5);
      var element = $this.q18();
      // Inline function 'kotlin.collections.set' call
      result.c2(key, element);
      lastToken = $this.h18_1.r18();
      var tmp0_subject = lastToken;
      if (tmp0_subject !== 4)
        if (tmp0_subject === 7)
          break $l$loop;
        else {
          $this.h18_1.k17('Expected end of the object or comma');
        }
    }
    if (lastToken === 6) {
      $this.h18_1.l18(7);
    } else if (lastToken === 4) {
      if (!$this.j18_1) {
        invalidTrailingComma($this.h18_1);
      }
      $this.h18_1.l18(7);
    }
    return new JsonObject(result);
  }
  function readObject_0($this, _this__u8e3s4, $completion) {
    var tmp = new $readObjectCOROUTINE$0($this, _this__u8e3s4, $completion);
    tmp.a8_1 = Unit_instance;
    tmp.b8_1 = null;
    return tmp.g8();
  }
  function readArray($this) {
    var lastToken = $this.h18_1.r18();
    if ($this.h18_1.m18() === 4) {
      $this.h18_1.k17('Unexpected leading comma');
    }
    // Inline function 'kotlin.collections.arrayListOf' call
    var result = ArrayList_init_$Create$();
    while ($this.h18_1.n18()) {
      var element = $this.q18();
      result.e(element);
      lastToken = $this.h18_1.r18();
      if (!(lastToken === 4)) {
        var tmp0 = $this.h18_1;
        // Inline function 'kotlinx.serialization.json.internal.AbstractJsonLexer.require' call
        var condition = lastToken === 9;
        var position = tmp0.f13_1;
        if (!condition) {
          var tmp$ret$1 = 'Expected end of the array or comma';
          tmp0.k17(tmp$ret$1, position);
        }
      }
    }
    if (lastToken === 8) {
      $this.h18_1.l18(9);
    } else if (lastToken === 4) {
      if (!$this.j18_1) {
        invalidTrailingComma($this.h18_1, 'array');
      }
      $this.h18_1.l18(9);
    }
    return new JsonArray(result);
  }
  function readValue($this, isString) {
    var tmp;
    if ($this.i18_1 || !isString) {
      tmp = $this.h18_1.p18();
    } else {
      tmp = $this.h18_1.o18();
    }
    var string = tmp;
    if (!isString && string === 'null')
      return JsonNull_getInstance();
    return new JsonLiteral(string, isString);
  }
  function readDeepRecursive($this) {
    return invoke(new DeepRecursiveFunction(JsonTreeReader$readDeepRecursive$slambda_0($this, null)), Unit_instance);
  }
  function JsonTreeReader$readDeepRecursive$slambda(this$0, resultContinuation) {
    this.p19_1 = this$0;
    CoroutineImpl.call(this, resultContinuation);
  }
  protoOf(JsonTreeReader$readDeepRecursive$slambda).u19 = function ($this$DeepRecursiveFunction, it, $completion) {
    var tmp = this.v19($this$DeepRecursiveFunction, it, $completion);
    tmp.a8_1 = Unit_instance;
    tmp.b8_1 = null;
    return tmp.g8();
  };
  protoOf(JsonTreeReader$readDeepRecursive$slambda).m8 = function (p1, p2, $completion) {
    var tmp = p1 instanceof DeepRecursiveScope ? p1 : THROW_CCE();
    return this.u19(tmp, p2 instanceof Unit ? p2 : THROW_CCE(), $completion);
  };
  protoOf(JsonTreeReader$readDeepRecursive$slambda).g8 = function () {
    var suspendResult = this.a8_1;
    $sm: do
      try {
        var tmp = this.y7_1;
        switch (tmp) {
          case 0:
            this.z7_1 = 3;
            this.s19_1 = this.p19_1.h18_1.m18();
            if (this.s19_1 === 1) {
              this.t19_1 = readValue(this.p19_1, true);
              this.y7_1 = 2;
              continue $sm;
            } else {
              if (this.s19_1 === 0) {
                this.t19_1 = readValue(this.p19_1, false);
                this.y7_1 = 2;
                continue $sm;
              } else {
                if (this.s19_1 === 6) {
                  this.y7_1 = 1;
                  suspendResult = readObject_0(this.p19_1, this.q19_1, this);
                  if (suspendResult === get_COROUTINE_SUSPENDED()) {
                    return suspendResult;
                  }
                  continue $sm;
                } else {
                  if (this.s19_1 === 8) {
                    this.t19_1 = readArray(this.p19_1);
                    this.y7_1 = 2;
                    continue $sm;
                  } else {
                    var tmp_0 = this;
                    this.p19_1.h18_1.k17("Can't begin reading element, unexpected token");
                  }
                }
              }
            }

            break;
          case 1:
            this.t19_1 = suspendResult;
            this.y7_1 = 2;
            continue $sm;
          case 2:
            return this.t19_1;
          case 3:
            throw this.b8_1;
        }
      } catch ($p) {
        var e = $p;
        if (this.z7_1 === 3) {
          throw e;
        } else {
          this.y7_1 = this.z7_1;
          this.b8_1 = e;
        }
      }
     while (true);
  };
  protoOf(JsonTreeReader$readDeepRecursive$slambda).v19 = function ($this$DeepRecursiveFunction, it, completion) {
    var i = new JsonTreeReader$readDeepRecursive$slambda(this.p19_1, completion);
    i.q19_1 = $this$DeepRecursiveFunction;
    i.r19_1 = it;
    return i;
  };
  function JsonTreeReader$readDeepRecursive$slambda_0(this$0, resultContinuation) {
    var i = new JsonTreeReader$readDeepRecursive$slambda(this$0, resultContinuation);
    var l = function ($this$DeepRecursiveFunction, it, $completion) {
      return i.u19($this$DeepRecursiveFunction, it, $completion);
    };
    l.$arity = 2;
    return l;
  }
  function $readObjectCOROUTINE$0(_this__u8e3s4, _this__u8e3s4_0, resultContinuation) {
    CoroutineImpl.call(this, resultContinuation);
    this.a19_1 = _this__u8e3s4;
    this.b19_1 = _this__u8e3s4_0;
  }
  protoOf($readObjectCOROUTINE$0).g8 = function () {
    var suspendResult = this.a8_1;
    $sm: do
      try {
        var tmp = this.y7_1;
        switch (tmp) {
          case 0:
            this.z7_1 = 5;
            var tmp_0 = this;
            tmp_0.c19_1 = this.a19_1;
            this.d19_1 = this.c19_1;
            this.e19_1 = this.d19_1.h18_1.l18(6);
            if (this.d19_1.h18_1.m18() === 4) {
              this.d19_1.h18_1.k17('Unexpected leading comma');
            }

            var tmp_1 = this;
            tmp_1.f19_1 = LinkedHashMap_init_$Create$();
            this.y7_1 = 1;
            continue $sm;
          case 1:
            if (!this.d19_1.h18_1.n18()) {
              this.y7_1 = 4;
              continue $sm;
            }

            this.g19_1 = this.d19_1.i18_1 ? this.d19_1.h18_1.p18() : this.d19_1.h18_1.o18();
            this.d19_1.h18_1.l18(5);
            this.y7_1 = 2;
            suspendResult = this.b19_1.hg(Unit_instance, this);
            if (suspendResult === get_COROUTINE_SUSPENDED()) {
              return suspendResult;
            }

            continue $sm;
          case 2:
            var element = suspendResult;
            var tmp0 = this.f19_1;
            var key = this.g19_1;
            tmp0.c2(key, element);
            this.e19_1 = this.d19_1.h18_1.r18();
            var tmp0_subject = this.e19_1;
            if (tmp0_subject === 4) {
              this.y7_1 = 3;
              continue $sm;
            } else {
              if (tmp0_subject === 7) {
                this.y7_1 = 4;
                continue $sm;
              } else {
                this.d19_1.h18_1.k17('Expected end of the object or comma');
              }
            }

            break;
          case 3:
            this.y7_1 = 1;
            continue $sm;
          case 4:
            if (this.e19_1 === 6) {
              this.d19_1.h18_1.l18(7);
            } else if (this.e19_1 === 4) {
              if (!this.d19_1.j18_1) {
                invalidTrailingComma(this.d19_1.h18_1);
              }
              this.d19_1.h18_1.l18(7);
            }

            return new JsonObject(this.f19_1);
          case 5:
            throw this.b8_1;
        }
      } catch ($p) {
        var e = $p;
        if (this.z7_1 === 5) {
          throw e;
        } else {
          this.y7_1 = this.z7_1;
          this.b8_1 = e;
        }
      }
     while (true);
  };
  function JsonTreeReader(configuration, lexer) {
    this.h18_1 = lexer;
    this.i18_1 = configuration.f14_1;
    this.j18_1 = configuration.r14_1;
    this.k18_1 = 0;
  }
  protoOf(JsonTreeReader).q18 = function () {
    var token = this.h18_1.m18();
    var tmp;
    if (token === 1) {
      tmp = readValue(this, true);
    } else if (token === 0) {
      tmp = readValue(this, false);
    } else if (token === 6) {
      var tmp_0;
      this.k18_1 = this.k18_1 + 1 | 0;
      if (this.k18_1 === 200) {
        tmp_0 = readDeepRecursive(this);
      } else {
        tmp_0 = readObject(this);
      }
      var result = tmp_0;
      this.k18_1 = this.k18_1 - 1 | 0;
      tmp = result;
    } else if (token === 8) {
      tmp = readArray(this);
    } else {
      this.h18_1.k17('Cannot read Json element because of unexpected ' + tokenDescription(token));
    }
    return tmp;
  };
  function classDiscriminator(_this__u8e3s4, json) {
    var _iterator__ex2g4s = _this__u8e3s4.yj().g();
    while (_iterator__ex2g4s.h()) {
      var annotation = _iterator__ex2g4s.i();
      if (annotation instanceof JsonClassDiscriminator)
        return annotation.w19_1;
    }
    return json.q12_1.m14_1;
  }
  function validateIfSealed(serializer, actualSerializer, classDiscriminator) {
    if (!(serializer instanceof SealedClassSerializer))
      return Unit_instance;
    if (jsonCachedSerialNames(actualSerializer.qi()).p1(classDiscriminator)) {
      var baseName = serializer.qi().uj();
      var actualName = actualSerializer.qi().uj();
      // Inline function 'kotlin.error' call
      var message = "Sealed class '" + actualName + "' cannot be serialized as base class '" + baseName + "' because" + (" it has property name that conflicts with JSON class discriminator '" + classDiscriminator + "'. ") + 'You can either change class discriminator in JsonConfiguration, ' + 'rename property with @SerialName annotation or fall back to array polymorphism';
      throw IllegalStateException_init_$Create$(toString(message));
    }
  }
  function checkKind(kind) {
    if (kind instanceof ENUM) {
      // Inline function 'kotlin.error' call
      var message = "Enums cannot be serialized polymorphically with 'type' parameter. You can use 'JsonBuilder.useArrayPolymorphism' instead";
      throw IllegalStateException_init_$Create$(toString(message));
    }
    if (kind instanceof PrimitiveKind) {
      // Inline function 'kotlin.error' call
      var message_0 = "Primitives cannot be serialized polymorphically with 'type' parameter. You can use 'JsonBuilder.useArrayPolymorphism' instead";
      throw IllegalStateException_init_$Create$(toString(message_0));
    }
    if (kind instanceof PolymorphicKind) {
      // Inline function 'kotlin.error' call
      var message_1 = 'Actual serializer for polymorphic cannot be polymorphic itself';
      throw IllegalStateException_init_$Create$(toString(message_1));
    }
  }
  function access$validateIfSealed$tPolymorphicKt(serializer, actualSerializer, classDiscriminator) {
    return validateIfSealed(serializer, actualSerializer, classDiscriminator);
  }
  function checkKind_0($this, descriptor, actualClass) {
    var kind = descriptor.vj();
    var tmp;
    if (kind instanceof PolymorphicKind) {
      tmp = true;
    } else {
      tmp = equals(kind, CONTEXTUAL_getInstance());
    }
    if (tmp) {
      throw IllegalArgumentException_init_$Create$('Serializer for ' + actualClass.z8() + " can't be registered as a subclass for polymorphic serialization " + ('because its kind ' + kind.toString() + ' is not concrete. To work with multiple hierarchies, register it as a base class.'));
    }
    if ($this.x19_1)
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
      throw IllegalArgumentException_init_$Create$('Serializer for ' + actualClass.z8() + ' of kind ' + kind.toString() + ' cannot be serialized polymorphically with class discriminator.');
    }
  }
  function checkDiscriminatorCollisions($this, descriptor, actualClass) {
    var inductionVariable = 0;
    var last = descriptor.xj();
    if (inductionVariable < last)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        var name = descriptor.zj(i);
        if (name === $this.y19_1) {
          throw IllegalArgumentException_init_$Create$('Polymorphic serializer for ' + toString(actualClass) + " has property '" + name + "' that conflicts " + 'with JSON class discriminator. You can either change class discriminator in JsonConfiguration, ' + 'rename property with @SerialName annotation ' + 'or fall back to array polymorphism');
        }
      }
       while (inductionVariable < last);
  }
  function PolymorphismValidator(useArrayPolymorphism, discriminator) {
    this.x19_1 = useArrayPolymorphism;
    this.y19_1 = discriminator;
  }
  protoOf(PolymorphismValidator).h12 = function (kClass, provider) {
  };
  protoOf(PolymorphismValidator).k12 = function (baseClass, actualClass, actualSerializer) {
    var descriptor = actualSerializer.qi();
    checkKind_0(this, descriptor, actualClass);
    if (!this.x19_1) {
      checkDiscriminatorCollisions(this, descriptor, actualClass);
    }
  };
  protoOf(PolymorphismValidator).l12 = function (baseClass, defaultSerializerProvider) {
  };
  protoOf(PolymorphismValidator).m12 = function (baseClass, defaultDeserializerProvider) {
  };
  function Key() {
  }
  function DescriptorSchemaCache() {
    this.l17_1 = createMapForCache(16);
  }
  protoOf(DescriptorSchemaCache).z19 = function (descriptor, key, value) {
    // Inline function 'kotlin.collections.getOrPut' call
    var this_0 = this.l17_1;
    var value_0 = this_0.v1(descriptor);
    var tmp;
    if (value_0 == null) {
      var answer = createMapForCache(2);
      this_0.c2(descriptor, answer);
      tmp = answer;
    } else {
      tmp = value_0;
    }
    var tmp2 = tmp;
    var tmp3 = key instanceof Key ? key : THROW_CCE();
    // Inline function 'kotlin.collections.set' call
    var value_1 = !(value == null) ? value : THROW_CCE();
    tmp2.c2(tmp3, value_1);
  };
  protoOf(DescriptorSchemaCache).m17 = function (descriptor, key, defaultValue) {
    var tmp0_safe_receiver = this.a1a(descriptor, key);
    if (tmp0_safe_receiver == null)
      null;
    else {
      // Inline function 'kotlin.let' call
      return tmp0_safe_receiver;
    }
    var value = defaultValue();
    this.z19(descriptor, key, value);
    return value;
  };
  protoOf(DescriptorSchemaCache).a1a = function (descriptor, key) {
    var tmp0_safe_receiver = this.l17_1.v1(descriptor);
    var tmp;
    if (tmp0_safe_receiver == null) {
      tmp = null;
    } else {
      tmp = tmp0_safe_receiver.v1(key instanceof Key ? key : THROW_CCE());
    }
    var tmp_0 = tmp;
    return !(tmp_0 == null) ? tmp_0 : null;
  };
  function DiscriminatorHolder(discriminatorToSkip) {
    this.b1a_1 = discriminatorToSkip;
  }
  function trySkip($this, _this__u8e3s4, unknownKey) {
    if (_this__u8e3s4 == null)
      return false;
    if (_this__u8e3s4.b1a_1 === unknownKey) {
      _this__u8e3s4.b1a_1 = null;
      return true;
    }
    return false;
  }
  function skipLeftoverElements($this, descriptor) {
    while (!($this.im(descriptor) === -1)) {
    }
  }
  function checkLeadingComma($this) {
    if ($this.z12_1.m18() === 4) {
      $this.z12_1.k17('Unexpected leading comma');
    }
  }
  function decodeMapIndex($this) {
    var hasComma = false;
    var decodingKey = !(($this.b13_1 % 2 | 0) === 0);
    if (decodingKey) {
      if (!($this.b13_1 === -1)) {
        hasComma = $this.z12_1.d1a();
      }
    } else {
      $this.z12_1.c1a(_Char___init__impl__6a9atx(58));
    }
    var tmp;
    if ($this.z12_1.n18()) {
      if (decodingKey) {
        if ($this.b13_1 === -1) {
          var tmp0 = $this.z12_1;
          // Inline function 'kotlinx.serialization.json.internal.AbstractJsonLexer.require' call
          var condition = !hasComma;
          var position = tmp0.f13_1;
          if (!condition) {
            var tmp$ret$0 = 'Unexpected leading comma';
            tmp0.k17(tmp$ret$0, position);
          }
        } else {
          var tmp3 = $this.z12_1;
          // Inline function 'kotlinx.serialization.json.internal.AbstractJsonLexer.require' call
          var condition_0 = hasComma;
          var position_0 = tmp3.f13_1;
          if (!condition_0) {
            var tmp$ret$2 = 'Expected comma after the key-value pair';
            tmp3.k17(tmp$ret$2, position_0);
          }
        }
      }
      $this.b13_1 = $this.b13_1 + 1 | 0;
      tmp = $this.b13_1;
    } else {
      if (hasComma && !$this.x12_1.q12_1.r14_1) {
        invalidTrailingComma($this.z12_1);
      }
      tmp = -1;
    }
    return tmp;
  }
  function coerceInputValue($this, descriptor, index) {
    var tmp0 = $this.x12_1;
    var tmp$ret$1;
    $l$block_2: {
      // Inline function 'kotlinx.serialization.json.internal.tryCoerceValue' call
      var isOptional = descriptor.dk(index);
      var elementDescriptor = descriptor.ck(index);
      var tmp;
      if (isOptional && !elementDescriptor.qj()) {
        tmp = $this.z12_1.e1a(true);
      } else {
        tmp = false;
      }
      if (tmp) {
        tmp$ret$1 = true;
        break $l$block_2;
      }
      if (equals(elementDescriptor.vj(), ENUM_getInstance())) {
        var tmp_0;
        if (elementDescriptor.qj()) {
          tmp_0 = $this.z12_1.e1a(false);
        } else {
          tmp_0 = false;
        }
        if (tmp_0) {
          tmp$ret$1 = false;
          break $l$block_2;
        }
        var tmp0_elvis_lhs = $this.z12_1.f1a($this.d13_1.f14_1);
        var tmp_1;
        if (tmp0_elvis_lhs == null) {
          tmp$ret$1 = false;
          break $l$block_2;
        } else {
          tmp_1 = tmp0_elvis_lhs;
        }
        var enumValue = tmp_1;
        var enumIndex = getJsonNameIndex(elementDescriptor, tmp0, enumValue);
        var coerceToNull = !tmp0.q12_1.i14_1 && elementDescriptor.qj();
        if (enumIndex === -3 && (isOptional || coerceToNull)) {
          $this.z12_1.o18();
          tmp$ret$1 = true;
          break $l$block_2;
        }
      }
      tmp$ret$1 = false;
    }
    return tmp$ret$1;
  }
  function decodeObjectIndex($this, descriptor) {
    var hasComma = $this.z12_1.d1a();
    while ($this.z12_1.n18()) {
      hasComma = false;
      var key = decodeStringKey($this);
      $this.z12_1.c1a(_Char___init__impl__6a9atx(58));
      var index = getJsonNameIndex(descriptor, $this.x12_1, key);
      var tmp;
      if (!(index === -3)) {
        var tmp_0;
        if ($this.d13_1.k14_1 && coerceInputValue($this, descriptor, index)) {
          hasComma = $this.z12_1.d1a();
          tmp_0 = false;
        } else {
          var tmp0_safe_receiver = $this.e13_1;
          if (tmp0_safe_receiver == null)
            null;
          else {
            tmp0_safe_receiver.h17(index);
          }
          return index;
        }
        tmp = tmp_0;
      } else {
        tmp = true;
      }
      var isUnknown = tmp;
      if (isUnknown) {
        hasComma = handleUnknown($this, key);
      }
    }
    if (hasComma && !$this.x12_1.q12_1.r14_1) {
      invalidTrailingComma($this.z12_1);
    }
    var tmp1_safe_receiver = $this.e13_1;
    var tmp2_elvis_lhs = tmp1_safe_receiver == null ? null : tmp1_safe_receiver.i17();
    return tmp2_elvis_lhs == null ? -1 : tmp2_elvis_lhs;
  }
  function handleUnknown($this, key) {
    if ($this.d13_1.e14_1 || trySkip($this, $this.c13_1, key)) {
      $this.z12_1.h1a($this.d13_1.f14_1);
    } else {
      $this.z12_1.g1a(key);
    }
    return $this.z12_1.d1a();
  }
  function decodeListIndex($this) {
    var hasComma = $this.z12_1.d1a();
    var tmp;
    if ($this.z12_1.n18()) {
      if (!($this.b13_1 === -1) && !hasComma) {
        $this.z12_1.k17('Expected end of the array or comma');
      }
      $this.b13_1 = $this.b13_1 + 1 | 0;
      tmp = $this.b13_1;
    } else {
      if (hasComma && !$this.x12_1.q12_1.r14_1) {
        invalidTrailingComma($this.z12_1, 'array');
      }
      tmp = -1;
    }
    return tmp;
  }
  function decodeStringKey($this) {
    var tmp;
    if ($this.d13_1.f14_1) {
      tmp = $this.z12_1.j1a();
    } else {
      tmp = $this.z12_1.i1a();
    }
    return tmp;
  }
  function StreamingJsonDecoder(json, mode, lexer, descriptor, discriminatorHolder) {
    AbstractDecoder.call(this);
    this.x12_1 = json;
    this.y12_1 = mode;
    this.z12_1 = lexer;
    this.a13_1 = this.x12_1.gm();
    this.b13_1 = -1;
    this.c13_1 = discriminatorHolder;
    this.d13_1 = this.x12_1.q12_1;
    this.e13_1 = this.d13_1.i14_1 ? null : new JsonElementMarker(descriptor);
  }
  protoOf(StreamingJsonDecoder).u14 = function () {
    return this.x12_1;
  };
  protoOf(StreamingJsonDecoder).gm = function () {
    return this.a13_1;
  };
  protoOf(StreamingJsonDecoder).v14 = function () {
    return (new JsonTreeReader(this.x12_1.q12_1, this.z12_1)).q18();
  };
  protoOf(StreamingJsonDecoder).ql = function (deserializer) {
    try {
      var tmp;
      if (!(deserializer instanceof AbstractPolymorphicSerializer)) {
        tmp = true;
      } else {
        tmp = this.x12_1.q12_1.l14_1;
      }
      if (tmp) {
        return deserializer.si(this);
      }
      var discriminator = classDiscriminator(deserializer.qi(), this.x12_1);
      var tmp0_elvis_lhs = this.z12_1.k1a(discriminator, this.d13_1.f14_1);
      var tmp_0;
      if (tmp0_elvis_lhs == null) {
        var tmp1 = isInterface(deserializer, DeserializationStrategy) ? deserializer : THROW_CCE();
        var tmp$ret$0;
        $l$block: {
          // Inline function 'kotlinx.serialization.json.internal.decodeSerializableValuePolymorphic' call
          var tmp_1;
          if (!(tmp1 instanceof AbstractPolymorphicSerializer)) {
            tmp_1 = true;
          } else {
            tmp_1 = this.u14().q12_1.l14_1;
          }
          if (tmp_1) {
            tmp$ret$0 = tmp1.si(this);
            break $l$block;
          }
          var discriminator_0 = classDiscriminator(tmp1.qi(), this.u14());
          var tmp0 = this.v14();
          // Inline function 'kotlinx.serialization.json.internal.cast' call
          var serialName = tmp1.qi().uj();
          if (!(tmp0 instanceof JsonObject)) {
            var tmp_2 = getKClass(JsonObject).z8();
            var tmp_3 = getKClassFromExpression(tmp0).z8();
            var tmp$ret$1 = this.z12_1.g13_1.x17();
            throw JsonDecodingException_0(-1, 'Expected ' + tmp_2 + ', but had ' + tmp_3 + ' as the serialized body of ' + serialName + ' at element: ' + tmp$ret$1, toString(tmp0));
          }
          var jsonTree = tmp0;
          var tmp0_safe_receiver = jsonTree.vb(discriminator_0);
          var tmp1_safe_receiver = tmp0_safe_receiver == null ? null : get_jsonPrimitive(tmp0_safe_receiver);
          var type = tmp1_safe_receiver == null ? null : get_contentOrNull(tmp1_safe_receiver);
          var tmp_4;
          try {
            tmp_4 = findPolymorphicSerializer(tmp1, this, type);
          } catch ($p) {
            var tmp_5;
            if ($p instanceof SerializationException) {
              var it = $p;
              throw JsonDecodingException_0(-1, ensureNotNull(it.message), jsonTree.toString());
            } else {
              throw $p;
            }
          }
          var tmp_6 = tmp_4;
          var actualSerializer = isInterface(tmp_6, DeserializationStrategy) ? tmp_6 : THROW_CCE();
          tmp$ret$0 = readPolymorphicJson(this.u14(), discriminator_0, jsonTree, actualSerializer);
        }
        return tmp$ret$0;
      } else {
        tmp_0 = tmp0_elvis_lhs;
      }
      var type_0 = tmp_0;
      var tmp_7;
      try {
        tmp_7 = findPolymorphicSerializer(deserializer, this, type_0);
      } catch ($p) {
        var tmp_8;
        if ($p instanceof SerializationException) {
          var it_0 = $p;
          var message = removeSuffix(substringBefore(ensureNotNull(it_0.message), _Char___init__impl__6a9atx(10)), '.');
          var hint = substringAfter(ensureNotNull(it_0.message), _Char___init__impl__6a9atx(10), '');
          this.z12_1.k17(message, VOID, hint);
        } else {
          throw $p;
        }
        tmp_7 = tmp_8;
      }
      var tmp_9 = tmp_7;
      var actualSerializer_0 = isInterface(tmp_9, DeserializationStrategy) ? tmp_9 : THROW_CCE();
      this.c13_1 = new DiscriminatorHolder(discriminator);
      return actualSerializer_0.si(this);
    } catch ($p) {
      if ($p instanceof MissingFieldException) {
        var e = $p;
        if (contains_0(ensureNotNull(e.message), 'at path'))
          throw e;
        throw new MissingFieldException(e.kj_1, plus(e.message, ' at path: ') + this.z12_1.g13_1.x17(), e);
      } else {
        throw $p;
      }
    }
  };
  protoOf(StreamingJsonDecoder).rl = function (descriptor) {
    var newMode = switchMode(this.x12_1, descriptor);
    this.z12_1.g13_1.s17(descriptor);
    this.z12_1.c1a(newMode.n1a_1);
    checkLeadingComma(this);
    var tmp;
    switch (newMode.e2_1) {
      case 1:
      case 2:
      case 3:
        tmp = new StreamingJsonDecoder(this.x12_1, newMode, this.z12_1, descriptor, this.c13_1);
        break;
      default:
        var tmp_0;
        if (this.y12_1.equals(newMode) && this.x12_1.q12_1.i14_1) {
          tmp_0 = this;
        } else {
          tmp_0 = new StreamingJsonDecoder(this.x12_1, newMode, this.z12_1, descriptor, this.c13_1);
        }

        tmp = tmp_0;
        break;
    }
    return tmp;
  };
  protoOf(StreamingJsonDecoder).sl = function (descriptor) {
    if (this.x12_1.q12_1.e14_1 && descriptor.xj() === 0) {
      skipLeftoverElements(this, descriptor);
    }
    if (this.z12_1.d1a() && !this.x12_1.q12_1.r14_1) {
      invalidTrailingComma(this.z12_1, '');
    }
    this.z12_1.c1a(this.y12_1.o1a_1);
    this.z12_1.g13_1.w17();
  };
  protoOf(StreamingJsonDecoder).cl = function () {
    var tmp;
    var tmp0_safe_receiver = this.e13_1;
    var tmp1_elvis_lhs = tmp0_safe_receiver == null ? null : tmp0_safe_receiver.g17_1;
    if (!(tmp1_elvis_lhs == null ? false : tmp1_elvis_lhs)) {
      tmp = !this.z12_1.p1a();
    } else {
      tmp = false;
    }
    return tmp;
  };
  protoOf(StreamingJsonDecoder).dl = function () {
    return null;
  };
  protoOf(StreamingJsonDecoder).dm = function (descriptor, index, deserializer, previousValue) {
    var isMapKey = this.y12_1.equals(WriteMode_MAP_getInstance()) && (index & 1) === 0;
    if (isMapKey) {
      this.z12_1.g13_1.v17();
    }
    var value = protoOf(AbstractDecoder).dm.call(this, descriptor, index, deserializer, previousValue);
    if (isMapKey) {
      this.z12_1.g13_1.u17(value);
    }
    return value;
  };
  protoOf(StreamingJsonDecoder).im = function (descriptor) {
    var index;
    switch (this.y12_1.e2_1) {
      case 0:
        index = decodeObjectIndex(this, descriptor);
        break;
      case 2:
        index = decodeMapIndex(this);
        break;
      default:
        index = decodeListIndex(this);
        break;
    }
    if (!this.y12_1.equals(WriteMode_MAP_getInstance())) {
      this.z12_1.g13_1.t17(index);
    }
    return index;
  };
  protoOf(StreamingJsonDecoder).el = function () {
    return this.z12_1.q1a();
  };
  protoOf(StreamingJsonDecoder).fl = function () {
    var value = this.z12_1.g15();
    if (!value.equals(toLong(value.x2()))) {
      this.z12_1.k17("Failed to parse byte for input '" + value.toString() + "'");
    }
    return value.x2();
  };
  protoOf(StreamingJsonDecoder).gl = function () {
    var value = this.z12_1.g15();
    if (!value.equals(toLong(value.y2()))) {
      this.z12_1.k17("Failed to parse short for input '" + value.toString() + "'");
    }
    return value.y2();
  };
  protoOf(StreamingJsonDecoder).hl = function () {
    var value = this.z12_1.g15();
    if (!value.equals(toLong(value.a1()))) {
      this.z12_1.k17("Failed to parse int for input '" + value.toString() + "'");
    }
    return value.a1();
  };
  protoOf(StreamingJsonDecoder).il = function () {
    return this.z12_1.g15();
  };
  protoOf(StreamingJsonDecoder).jl = function () {
    var tmp0 = this.z12_1;
    var tmp$ret$4;
    $l$block: {
      // Inline function 'kotlinx.serialization.json.internal.parseString' call
      var input = tmp0.p18();
      try {
        // Inline function 'kotlin.text.toFloat' call
        // Inline function 'kotlin.js.unsafeCast' call
        // Inline function 'kotlin.js.asDynamic' call
        tmp$ret$4 = toDouble(input);
        break $l$block;
      } catch ($p) {
        if ($p instanceof IllegalArgumentException) {
          var e = $p;
          tmp0.k17("Failed to parse type '" + 'float' + "' for input '" + input + "'");
        } else {
          throw $p;
        }
      }
    }
    var result = tmp$ret$4;
    var specialFp = this.x12_1.q12_1.n14_1;
    if (specialFp || isFinite(result))
      return result;
    throwInvalidFloatingPointDecoded(this.z12_1, result);
  };
  protoOf(StreamingJsonDecoder).kl = function () {
    var tmp0 = this.z12_1;
    var tmp$ret$1;
    $l$block: {
      // Inline function 'kotlinx.serialization.json.internal.parseString' call
      var input = tmp0.p18();
      try {
        tmp$ret$1 = toDouble(input);
        break $l$block;
      } catch ($p) {
        if ($p instanceof IllegalArgumentException) {
          var e = $p;
          tmp0.k17("Failed to parse type '" + 'double' + "' for input '" + input + "'");
        } else {
          throw $p;
        }
      }
    }
    var result = tmp$ret$1;
    var specialFp = this.x12_1.q12_1.n14_1;
    if (specialFp || isFinite_0(result))
      return result;
    throwInvalidFloatingPointDecoded(this.z12_1, result);
  };
  protoOf(StreamingJsonDecoder).ll = function () {
    var string = this.z12_1.p18();
    if (!(string.length === 1)) {
      this.z12_1.k17("Expected single char, but got '" + string + "'");
    }
    return charSequenceGet(string, 0);
  };
  protoOf(StreamingJsonDecoder).ml = function () {
    var tmp;
    if (this.d13_1.f14_1) {
      tmp = this.z12_1.j1a();
    } else {
      tmp = this.z12_1.o18();
    }
    return tmp;
  };
  protoOf(StreamingJsonDecoder).ol = function (descriptor) {
    return get_isUnsignedNumber(descriptor) ? new JsonDecoderForUnsignedTypes(this.z12_1, this.x12_1) : protoOf(AbstractDecoder).ol.call(this, descriptor);
  };
  protoOf(StreamingJsonDecoder).nl = function (enumDescriptor) {
    return getJsonNameIndexOrThrow(enumDescriptor, this.x12_1, this.ml(), ' at path ' + this.z12_1.g13_1.x17());
  };
  function JsonDecoderForUnsignedTypes(lexer, json) {
    AbstractDecoder.call(this);
    this.r1a_1 = lexer;
    this.s1a_1 = json.gm();
  }
  protoOf(JsonDecoderForUnsignedTypes).gm = function () {
    return this.s1a_1;
  };
  protoOf(JsonDecoderForUnsignedTypes).im = function (descriptor) {
    var message = 'unsupported';
    throw IllegalStateException_init_$Create$(toString(message));
  };
  protoOf(JsonDecoderForUnsignedTypes).hl = function () {
    var tmp0 = this.r1a_1;
    var tmp$ret$2;
    $l$block: {
      // Inline function 'kotlinx.serialization.json.internal.parseString' call
      var input = tmp0.p18();
      try {
        // Inline function 'kotlin.UInt.toInt' call
        var this_0 = toUInt(input);
        tmp$ret$2 = _UInt___get_data__impl__f0vqqw(this_0);
        break $l$block;
      } catch ($p) {
        if ($p instanceof IllegalArgumentException) {
          var e = $p;
          tmp0.k17("Failed to parse type '" + 'UInt' + "' for input '" + input + "'");
        } else {
          throw $p;
        }
      }
    }
    return tmp$ret$2;
  };
  protoOf(JsonDecoderForUnsignedTypes).il = function () {
    var tmp0 = this.r1a_1;
    var tmp$ret$2;
    $l$block: {
      // Inline function 'kotlinx.serialization.json.internal.parseString' call
      var input = tmp0.p18();
      try {
        // Inline function 'kotlin.ULong.toLong' call
        var this_0 = toULong(input);
        tmp$ret$2 = _ULong___get_data__impl__fggpzb(this_0);
        break $l$block;
      } catch ($p) {
        if ($p instanceof IllegalArgumentException) {
          var e = $p;
          tmp0.k17("Failed to parse type '" + 'ULong' + "' for input '" + input + "'");
        } else {
          throw $p;
        }
      }
    }
    return tmp$ret$2;
  };
  protoOf(JsonDecoderForUnsignedTypes).fl = function () {
    var tmp0 = this.r1a_1;
    var tmp$ret$2;
    $l$block: {
      // Inline function 'kotlinx.serialization.json.internal.parseString' call
      var input = tmp0.p18();
      try {
        // Inline function 'kotlin.UByte.toByte' call
        var this_0 = toUByte(input);
        tmp$ret$2 = _UByte___get_data__impl__jof9qr(this_0);
        break $l$block;
      } catch ($p) {
        if ($p instanceof IllegalArgumentException) {
          var e = $p;
          tmp0.k17("Failed to parse type '" + 'UByte' + "' for input '" + input + "'");
        } else {
          throw $p;
        }
      }
    }
    return tmp$ret$2;
  };
  protoOf(JsonDecoderForUnsignedTypes).gl = function () {
    var tmp0 = this.r1a_1;
    var tmp$ret$2;
    $l$block: {
      // Inline function 'kotlinx.serialization.json.internal.parseString' call
      var input = tmp0.p18();
      try {
        // Inline function 'kotlin.UShort.toShort' call
        var this_0 = toUShort(input);
        tmp$ret$2 = _UShort___get_data__impl__g0245(this_0);
        break $l$block;
      } catch ($p) {
        if ($p instanceof IllegalArgumentException) {
          var e = $p;
          tmp0.k17("Failed to parse type '" + 'UShort' + "' for input '" + input + "'");
        } else {
          throw $p;
        }
      }
    }
    return tmp$ret$2;
  };
  function get_unsignedNumberDescriptors() {
    _init_properties_StreamingJsonEncoder_kt__pn1bsi();
    return unsignedNumberDescriptors;
  }
  var unsignedNumberDescriptors;
  function StreamingJsonEncoder_init_$Init$(output, json, mode, modeReuseCache, $this) {
    StreamingJsonEncoder.call($this, Composer_0(output, json), json, mode, modeReuseCache);
    return $this;
  }
  function StreamingJsonEncoder_init_$Create$(output, json, mode, modeReuseCache) {
    return StreamingJsonEncoder_init_$Init$(output, json, mode, modeReuseCache, objectCreate(protoOf(StreamingJsonEncoder)));
  }
  function encodeTypeInfo($this, discriminator, serialName) {
    $this.y17_1.e16();
    $this.vm(discriminator);
    $this.y17_1.h16(_Char___init__impl__6a9atx(58));
    $this.y17_1.g16();
    $this.vm(serialName);
  }
  function StreamingJsonEncoder(composer, json, mode, modeReuseCache) {
    AbstractEncoder.call(this);
    this.y17_1 = composer;
    this.z17_1 = json;
    this.a18_1 = mode;
    this.b18_1 = modeReuseCache;
    this.c18_1 = this.z17_1.gm();
    this.d18_1 = this.z17_1.q12_1;
    this.e18_1 = false;
    this.f18_1 = null;
    this.g18_1 = null;
    var i = this.a18_1.e2_1;
    if (!(this.b18_1 == null)) {
      if (!(this.b18_1[i] === null) || !(this.b18_1[i] === this)) {
        this.b18_1[i] = this;
      }
    }
  }
  protoOf(StreamingJsonEncoder).u14 = function () {
    return this.z17_1;
  };
  protoOf(StreamingJsonEncoder).gm = function () {
    return this.c18_1;
  };
  protoOf(StreamingJsonEncoder).on = function (descriptor, index) {
    return this.d18_1.d14_1;
  };
  protoOf(StreamingJsonEncoder).jn = function (serializer, value) {
    $l$block: {
      // Inline function 'kotlinx.serialization.json.internal.encodePolymorphically' call
      if (this.u14().q12_1.l14_1) {
        serializer.ri(this, value);
        break $l$block;
      }
      var isPolymorphicSerializer = serializer instanceof AbstractPolymorphicSerializer;
      var tmp;
      if (isPolymorphicSerializer) {
        tmp = !this.u14().q12_1.t14_1.equals(ClassDiscriminatorMode_NONE_getInstance());
      } else {
        var tmp_0;
        switch (this.u14().q12_1.t14_1.e2_1) {
          case 0:
          case 2:
            tmp_0 = false;
            break;
          case 1:
            // Inline function 'kotlin.let' call

            var it = serializer.qi().vj();
            tmp_0 = equals(it, CLASS_getInstance()) || equals(it, OBJECT_getInstance());
            break;
          default:
            noWhenBranchMatchedException();
            break;
        }
        tmp = tmp_0;
      }
      var needDiscriminator = tmp;
      var baseClassDiscriminator = needDiscriminator ? classDiscriminator(serializer.qi(), this.u14()) : null;
      var tmp_1;
      if (isPolymorphicSerializer) {
        var casted = serializer instanceof AbstractPolymorphicSerializer ? serializer : THROW_CCE();
        $l$block_0: {
          // Inline function 'kotlin.requireNotNull' call
          if (value == null) {
            var message = 'Value for serializer ' + toString(serializer.qi()) + ' should always be non-null. Please report issue to the kotlinx.serialization tracker.';
            throw IllegalArgumentException_init_$Create$(toString(message));
          } else {
            break $l$block_0;
          }
        }
        var actual = findPolymorphicSerializer_0(casted, this, value);
        if (!(baseClassDiscriminator == null)) {
          access$validateIfSealed$tPolymorphicKt(serializer, actual, baseClassDiscriminator);
        }
        checkKind(actual.qi().vj());
        tmp_1 = isInterface(actual, SerializationStrategy) ? actual : THROW_CCE();
      } else {
        tmp_1 = serializer;
      }
      var actualSerializer = tmp_1;
      if (!(baseClassDiscriminator == null)) {
        var serialName = actualSerializer.qi().uj();
        this.f18_1 = baseClassDiscriminator;
        this.g18_1 = serialName;
      }
      actualSerializer.ri(this, value);
    }
  };
  protoOf(StreamingJsonEncoder).rl = function (descriptor) {
    var newMode = switchMode(this.z17_1, descriptor);
    if (!(newMode.n1a_1 === _Char___init__impl__6a9atx(0))) {
      this.y17_1.h16(newMode.n1a_1);
      this.y17_1.c16();
    }
    var discriminator = this.f18_1;
    if (!(discriminator == null)) {
      var tmp0_elvis_lhs = this.g18_1;
      encodeTypeInfo(this, discriminator, tmp0_elvis_lhs == null ? descriptor.uj() : tmp0_elvis_lhs);
      this.f18_1 = null;
      this.g18_1 = null;
    }
    if (this.a18_1.equals(newMode)) {
      return this;
    }
    var tmp1_safe_receiver = this.b18_1;
    var tmp2_elvis_lhs = tmp1_safe_receiver == null ? null : tmp1_safe_receiver[newMode.e2_1];
    return tmp2_elvis_lhs == null ? new StreamingJsonEncoder(this.y17_1, this.z17_1, newMode, this.b18_1) : tmp2_elvis_lhs;
  };
  protoOf(StreamingJsonEncoder).sl = function (descriptor) {
    if (!(this.a18_1.o1a_1 === _Char___init__impl__6a9atx(0))) {
      this.y17_1.d16();
      this.y17_1.f16();
      this.y17_1.h16(this.a18_1.o1a_1);
    }
  };
  protoOf(StreamingJsonEncoder).km = function (descriptor, index) {
    switch (this.a18_1.e2_1) {
      case 1:
        if (!this.y17_1.b16_1) {
          this.y17_1.h16(_Char___init__impl__6a9atx(44));
        }

        this.y17_1.e16();
        break;
      case 2:
        if (!this.y17_1.b16_1) {
          var tmp = this;
          var tmp_0;
          if ((index % 2 | 0) === 0) {
            this.y17_1.h16(_Char___init__impl__6a9atx(44));
            this.y17_1.e16();
            tmp_0 = true;
          } else {
            this.y17_1.h16(_Char___init__impl__6a9atx(58));
            this.y17_1.g16();
            tmp_0 = false;
          }
          tmp.e18_1 = tmp_0;
        } else {
          this.e18_1 = true;
          this.y17_1.e16();
        }

        break;
      case 3:
        if (index === 0)
          this.e18_1 = true;
        if (index === 1) {
          this.y17_1.h16(_Char___init__impl__6a9atx(44));
          this.y17_1.g16();
          this.e18_1 = false;
        }

        break;
      default:
        if (!this.y17_1.b16_1) {
          this.y17_1.h16(_Char___init__impl__6a9atx(44));
        }

        this.y17_1.e16();
        this.vm(getJsonElementName(descriptor, this.z17_1, index));
        this.y17_1.h16(_Char___init__impl__6a9atx(58));
        this.y17_1.g16();
        break;
    }
    return true;
  };
  protoOf(StreamingJsonEncoder).kn = function (descriptor, index, serializer, value) {
    if (!(value == null) || this.d18_1.i14_1) {
      protoOf(AbstractEncoder).kn.call(this, descriptor, index, serializer, value);
    }
  };
  protoOf(StreamingJsonEncoder).xm = function (descriptor) {
    var tmp;
    if (get_isUnsignedNumber(descriptor)) {
      // Inline function 'kotlinx.serialization.json.internal.StreamingJsonEncoder.composerAs' call
      var tmp_0;
      var tmp_1 = this.y17_1;
      if (tmp_1 instanceof ComposerForUnsignedNumbers) {
        tmp_0 = this.y17_1;
      } else {
        var tmp1 = this.y17_1.a16_1;
        var p1 = this.e18_1;
        tmp_0 = new ComposerForUnsignedNumbers(tmp1, p1);
      }
      var tmp$ret$1 = tmp_0;
      tmp = new StreamingJsonEncoder(tmp$ret$1, this.z17_1, this.a18_1, null);
    } else if (get_isUnquotedLiteral(descriptor)) {
      // Inline function 'kotlinx.serialization.json.internal.StreamingJsonEncoder.composerAs' call
      var tmp_2;
      var tmp_3 = this.y17_1;
      if (tmp_3 instanceof ComposerForUnquotedLiterals) {
        tmp_2 = this.y17_1;
      } else {
        var tmp4 = this.y17_1.a16_1;
        var p1_0 = this.e18_1;
        tmp_2 = new ComposerForUnquotedLiterals(tmp4, p1_0);
      }
      var tmp$ret$3 = tmp_2;
      tmp = new StreamingJsonEncoder(tmp$ret$3, this.z17_1, this.a18_1, null);
    } else if (!(this.f18_1 == null)) {
      // Inline function 'kotlin.apply' call
      this.g18_1 = descriptor.uj();
      tmp = this;
    } else {
      tmp = protoOf(AbstractEncoder).xm.call(this, descriptor);
    }
    return tmp;
  };
  protoOf(StreamingJsonEncoder).mm = function () {
    this.y17_1.j16('null');
  };
  protoOf(StreamingJsonEncoder).nm = function (value) {
    if (this.e18_1) {
      this.vm(value.toString());
    } else {
      this.y17_1.s16(value);
    }
  };
  protoOf(StreamingJsonEncoder).om = function (value) {
    if (this.e18_1) {
      this.vm(value.toString());
    } else {
      this.y17_1.n16(value);
    }
  };
  protoOf(StreamingJsonEncoder).pm = function (value) {
    if (this.e18_1) {
      this.vm(value.toString());
    } else {
      this.y17_1.p16(value);
    }
  };
  protoOf(StreamingJsonEncoder).qm = function (value) {
    if (this.e18_1) {
      this.vm(value.toString());
    } else {
      this.y17_1.q16(value);
    }
  };
  protoOf(StreamingJsonEncoder).rm = function (value) {
    if (this.e18_1) {
      this.vm(value.toString());
    } else {
      this.y17_1.r16(value);
    }
  };
  protoOf(StreamingJsonEncoder).sm = function (value) {
    if (this.e18_1) {
      this.vm(value.toString());
    } else {
      this.y17_1.l16(value);
    }
    if (!this.d18_1.n14_1 && !isFinite(value)) {
      throw InvalidFloatingPointEncoded(value, toString(this.y17_1.a16_1));
    }
  };
  protoOf(StreamingJsonEncoder).tm = function (value) {
    if (this.e18_1) {
      this.vm(value.toString());
    } else {
      this.y17_1.m16(value);
    }
    if (!this.d18_1.n14_1 && !isFinite_0(value)) {
      throw InvalidFloatingPointEncoded(value, toString(this.y17_1.a16_1));
    }
  };
  protoOf(StreamingJsonEncoder).um = function (value) {
    this.vm(toString_1(value));
  };
  protoOf(StreamingJsonEncoder).vm = function (value) {
    return this.y17_1.t16(value);
  };
  protoOf(StreamingJsonEncoder).wm = function (enumDescriptor, index) {
    this.vm(enumDescriptor.zj(index));
  };
  function get_isUnsignedNumber(_this__u8e3s4) {
    _init_properties_StreamingJsonEncoder_kt__pn1bsi();
    return _this__u8e3s4.wj() && get_unsignedNumberDescriptors().p1(_this__u8e3s4);
  }
  function get_isUnquotedLiteral(_this__u8e3s4) {
    _init_properties_StreamingJsonEncoder_kt__pn1bsi();
    return _this__u8e3s4.wj() && equals(_this__u8e3s4, get_jsonUnquotedLiteralDescriptor());
  }
  var properties_initialized_StreamingJsonEncoder_kt_6ifwwk;
  function _init_properties_StreamingJsonEncoder_kt__pn1bsi() {
    if (!properties_initialized_StreamingJsonEncoder_kt_6ifwwk) {
      properties_initialized_StreamingJsonEncoder_kt_6ifwwk = true;
      unsignedNumberDescriptors = setOf([serializer_1(Companion_getInstance_0()).qi(), serializer_0(Companion_getInstance()).qi(), serializer_2(Companion_getInstance_1()).qi(), serializer_3(Companion_getInstance_2()).qi()]);
    }
  }
  function get_ESCAPE_STRINGS() {
    _init_properties_StringOps_kt__fcy1db();
    return ESCAPE_STRINGS;
  }
  var ESCAPE_STRINGS;
  var ESCAPE_MARKERS;
  function toHexChar(i) {
    _init_properties_StringOps_kt__fcy1db();
    var d = i & 15;
    var tmp;
    if (d < 10) {
      // Inline function 'kotlin.code' call
      var this_0 = _Char___init__impl__6a9atx(48);
      var tmp$ret$0 = Char__toInt_impl_vasixd(this_0);
      tmp = numberToChar(d + tmp$ret$0 | 0);
    } else {
      var tmp_0 = d - 10 | 0;
      // Inline function 'kotlin.code' call
      var this_1 = _Char___init__impl__6a9atx(97);
      var tmp$ret$1 = Char__toInt_impl_vasixd(this_1);
      tmp = numberToChar(tmp_0 + tmp$ret$1 | 0);
    }
    return tmp;
  }
  function printQuoted(_this__u8e3s4, value) {
    _init_properties_StringOps_kt__fcy1db();
    _this__u8e3s4.g7(_Char___init__impl__6a9atx(34));
    var lastPos = 0;
    var inductionVariable = 0;
    var last = charSequenceLength(value) - 1 | 0;
    if (inductionVariable <= last)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        // Inline function 'kotlin.code' call
        var this_0 = charSequenceGet(value, i);
        var c = Char__toInt_impl_vasixd(this_0);
        if (c < get_ESCAPE_STRINGS().length && !(get_ESCAPE_STRINGS()[c] == null)) {
          _this__u8e3s4.ka(value, lastPos, i);
          _this__u8e3s4.f7(get_ESCAPE_STRINGS()[c]);
          lastPos = i + 1 | 0;
        }
      }
       while (inductionVariable <= last);
    if (!(lastPos === 0))
      _this__u8e3s4.ka(value, lastPos, value.length);
    else
      _this__u8e3s4.f7(value);
    _this__u8e3s4.g7(_Char___init__impl__6a9atx(34));
  }
  function toBooleanStrictOrNull_0(_this__u8e3s4) {
    _init_properties_StringOps_kt__fcy1db();
    return equals_0(_this__u8e3s4, 'true', true) ? true : equals_0(_this__u8e3s4, 'false', true) ? false : null;
  }
  var properties_initialized_StringOps_kt_wzaea7;
  function _init_properties_StringOps_kt__fcy1db() {
    if (!properties_initialized_StringOps_kt_wzaea7) {
      properties_initialized_StringOps_kt_wzaea7 = true;
      // Inline function 'kotlin.arrayOfNulls' call
      // Inline function 'kotlin.apply' call
      var this_0 = Array(93);
      var inductionVariable = 0;
      if (inductionVariable <= 31)
        do {
          var c = inductionVariable;
          inductionVariable = inductionVariable + 1 | 0;
          var c1 = toHexChar(c >> 12);
          var c2 = toHexChar(c >> 8);
          var c3 = toHexChar(c >> 4);
          var c4 = toHexChar(c);
          this_0[c] = '\\u' + toString_1(c1) + toString_1(c2) + toString_1(c3) + toString_1(c4);
        }
         while (inductionVariable <= 31);
      // Inline function 'kotlin.code' call
      var this_1 = _Char___init__impl__6a9atx(34);
      this_0[Char__toInt_impl_vasixd(this_1)] = '\\"';
      // Inline function 'kotlin.code' call
      var this_2 = _Char___init__impl__6a9atx(92);
      this_0[Char__toInt_impl_vasixd(this_2)] = '\\\\';
      // Inline function 'kotlin.code' call
      var this_3 = _Char___init__impl__6a9atx(9);
      this_0[Char__toInt_impl_vasixd(this_3)] = '\\t';
      // Inline function 'kotlin.code' call
      var this_4 = _Char___init__impl__6a9atx(8);
      this_0[Char__toInt_impl_vasixd(this_4)] = '\\b';
      // Inline function 'kotlin.code' call
      var this_5 = _Char___init__impl__6a9atx(10);
      this_0[Char__toInt_impl_vasixd(this_5)] = '\\n';
      // Inline function 'kotlin.code' call
      var this_6 = _Char___init__impl__6a9atx(13);
      this_0[Char__toInt_impl_vasixd(this_6)] = '\\r';
      this_0[12] = '\\f';
      ESCAPE_STRINGS = this_0;
      // Inline function 'kotlin.apply' call
      var this_7 = new Int8Array(93);
      var inductionVariable_0 = 0;
      if (inductionVariable_0 <= 31)
        do {
          var c_0 = inductionVariable_0;
          inductionVariable_0 = inductionVariable_0 + 1 | 0;
          this_7[c_0] = 1;
        }
         while (inductionVariable_0 <= 31);
      // Inline function 'kotlin.code' call
      var this_8 = _Char___init__impl__6a9atx(34);
      var tmp = Char__toInt_impl_vasixd(this_8);
      // Inline function 'kotlin.code' call
      var this_9 = _Char___init__impl__6a9atx(34);
      var tmp$ret$1 = Char__toInt_impl_vasixd(this_9);
      this_7[tmp] = toByte(tmp$ret$1);
      // Inline function 'kotlin.code' call
      var this_10 = _Char___init__impl__6a9atx(92);
      var tmp_0 = Char__toInt_impl_vasixd(this_10);
      // Inline function 'kotlin.code' call
      var this_11 = _Char___init__impl__6a9atx(92);
      var tmp$ret$3 = Char__toInt_impl_vasixd(this_11);
      this_7[tmp_0] = toByte(tmp$ret$3);
      // Inline function 'kotlin.code' call
      var this_12 = _Char___init__impl__6a9atx(9);
      var tmp_1 = Char__toInt_impl_vasixd(this_12);
      // Inline function 'kotlin.code' call
      var this_13 = _Char___init__impl__6a9atx(116);
      var tmp$ret$5 = Char__toInt_impl_vasixd(this_13);
      this_7[tmp_1] = toByte(tmp$ret$5);
      // Inline function 'kotlin.code' call
      var this_14 = _Char___init__impl__6a9atx(8);
      var tmp_2 = Char__toInt_impl_vasixd(this_14);
      // Inline function 'kotlin.code' call
      var this_15 = _Char___init__impl__6a9atx(98);
      var tmp$ret$7 = Char__toInt_impl_vasixd(this_15);
      this_7[tmp_2] = toByte(tmp$ret$7);
      // Inline function 'kotlin.code' call
      var this_16 = _Char___init__impl__6a9atx(10);
      var tmp_3 = Char__toInt_impl_vasixd(this_16);
      // Inline function 'kotlin.code' call
      var this_17 = _Char___init__impl__6a9atx(110);
      var tmp$ret$9 = Char__toInt_impl_vasixd(this_17);
      this_7[tmp_3] = toByte(tmp$ret$9);
      // Inline function 'kotlin.code' call
      var this_18 = _Char___init__impl__6a9atx(13);
      var tmp_4 = Char__toInt_impl_vasixd(this_18);
      // Inline function 'kotlin.code' call
      var this_19 = _Char___init__impl__6a9atx(114);
      var tmp$ret$11 = Char__toInt_impl_vasixd(this_19);
      this_7[tmp_4] = toByte(tmp$ret$11);
      // Inline function 'kotlin.code' call
      var this_20 = _Char___init__impl__6a9atx(102);
      var tmp$ret$12 = Char__toInt_impl_vasixd(this_20);
      this_7[12] = toByte(tmp$ret$12);
      ESCAPE_MARKERS = this_7;
    }
  }
  function unparsedPrimitive($this, literal, primitive, tag) {
    var type = startsWith(primitive, 'i') ? 'an ' + primitive : 'a ' + primitive;
    throw JsonDecodingException_0(-1, "Failed to parse literal '" + literal.toString() + "' as " + type + ' value at element: ' + $this.z1a(tag), toString($this.a1b()));
  }
  function AbstractJsonTreeDecoder(json, value, polymorphicDiscriminator) {
    polymorphicDiscriminator = polymorphicDiscriminator === VOID ? null : polymorphicDiscriminator;
    NamedValueDecoder.call(this);
    this.v1a_1 = json;
    this.w1a_1 = value;
    this.x1a_1 = polymorphicDiscriminator;
    this.y1a_1 = this.u14().q12_1;
  }
  protoOf(AbstractJsonTreeDecoder).u14 = function () {
    return this.v1a_1;
  };
  protoOf(AbstractJsonTreeDecoder).s1 = function () {
    return this.w1a_1;
  };
  protoOf(AbstractJsonTreeDecoder).gm = function () {
    return this.u14().gm();
  };
  protoOf(AbstractJsonTreeDecoder).a1b = function () {
    var tmp0_safe_receiver = this.xz();
    var tmp;
    if (tmp0_safe_receiver == null) {
      tmp = null;
    } else {
      // Inline function 'kotlin.let' call
      tmp = this.b1b(tmp0_safe_receiver);
    }
    var tmp1_elvis_lhs = tmp;
    return tmp1_elvis_lhs == null ? this.s1() : tmp1_elvis_lhs;
  };
  protoOf(AbstractJsonTreeDecoder).z1a = function (currentTag) {
    return this.zz() + ('.' + currentTag);
  };
  protoOf(AbstractJsonTreeDecoder).v14 = function () {
    return this.a1b();
  };
  protoOf(AbstractJsonTreeDecoder).ql = function (deserializer) {
    var tmp$ret$0;
    $l$block: {
      // Inline function 'kotlinx.serialization.json.internal.decodeSerializableValuePolymorphic' call
      var tmp;
      if (!(deserializer instanceof AbstractPolymorphicSerializer)) {
        tmp = true;
      } else {
        tmp = this.u14().q12_1.l14_1;
      }
      if (tmp) {
        tmp$ret$0 = deserializer.si(this);
        break $l$block;
      }
      var discriminator = classDiscriminator(deserializer.qi(), this.u14());
      var tmp0 = this.v14();
      // Inline function 'kotlinx.serialization.json.internal.cast' call
      var serialName = deserializer.qi().uj();
      if (!(tmp0 instanceof JsonObject)) {
        var tmp_0 = getKClass(JsonObject).z8();
        var tmp_1 = getKClassFromExpression(tmp0).z8();
        var tmp$ret$1 = this.zz();
        throw JsonDecodingException_0(-1, 'Expected ' + tmp_0 + ', but had ' + tmp_1 + ' as the serialized body of ' + serialName + ' at element: ' + tmp$ret$1, toString(tmp0));
      }
      var jsonTree = tmp0;
      var tmp0_safe_receiver = jsonTree.vb(discriminator);
      var tmp1_safe_receiver = tmp0_safe_receiver == null ? null : get_jsonPrimitive(tmp0_safe_receiver);
      var type = tmp1_safe_receiver == null ? null : get_contentOrNull(tmp1_safe_receiver);
      var tmp_2;
      try {
        tmp_2 = findPolymorphicSerializer(deserializer, this, type);
      } catch ($p) {
        var tmp_3;
        if ($p instanceof SerializationException) {
          var it = $p;
          throw JsonDecodingException_0(-1, ensureNotNull(it.message), jsonTree.toString());
        } else {
          throw $p;
        }
      }
      var tmp_4 = tmp_2;
      var actualSerializer = isInterface(tmp_4, DeserializationStrategy) ? tmp_4 : THROW_CCE();
      tmp$ret$0 = readPolymorphicJson(this.u14(), discriminator, jsonTree, actualSerializer);
    }
    return tmp$ret$0;
  };
  protoOf(AbstractJsonTreeDecoder).yz = function (parentName, childName) {
    return childName;
  };
  protoOf(AbstractJsonTreeDecoder).rl = function (descriptor) {
    var currentObject = this.a1b();
    var tmp0_subject = descriptor.vj();
    var tmp;
    var tmp_0;
    if (equals(tmp0_subject, LIST_getInstance())) {
      tmp_0 = true;
    } else {
      tmp_0 = tmp0_subject instanceof PolymorphicKind;
    }
    if (tmp_0) {
      var tmp_1 = this.u14();
      // Inline function 'kotlinx.serialization.json.internal.AbstractJsonTreeDecoder.cast' call
      // Inline function 'kotlinx.serialization.json.internal.cast' call
      var serialName = descriptor.uj();
      if (!(currentObject instanceof JsonArray)) {
        var tmp_2 = getKClass(JsonArray).z8();
        var tmp_3 = getKClassFromExpression(currentObject).z8();
        var tmp$ret$0 = this.zz();
        throw JsonDecodingException_0(-1, 'Expected ' + tmp_2 + ', but had ' + tmp_3 + ' as the serialized body of ' + serialName + ' at element: ' + tmp$ret$0, toString(currentObject));
      }
      tmp = new JsonTreeListDecoder(tmp_1, currentObject);
    } else {
      if (equals(tmp0_subject, MAP_getInstance())) {
        // Inline function 'kotlinx.serialization.json.internal.selectMapMode' call
        var this_0 = this.u14();
        var keyDescriptor = carrierDescriptor(descriptor.ck(0), this_0.gm());
        var keyKind = keyDescriptor.vj();
        var tmp_4;
        var tmp_5;
        if (keyKind instanceof PrimitiveKind) {
          tmp_5 = true;
        } else {
          tmp_5 = equals(keyKind, ENUM_getInstance());
        }
        if (tmp_5) {
          var tmp_6 = this.u14();
          // Inline function 'kotlinx.serialization.json.internal.AbstractJsonTreeDecoder.cast' call
          // Inline function 'kotlinx.serialization.json.internal.cast' call
          var serialName_0 = descriptor.uj();
          if (!(currentObject instanceof JsonObject)) {
            var tmp_7 = getKClass(JsonObject).z8();
            var tmp_8 = getKClassFromExpression(currentObject).z8();
            var tmp$ret$3 = this.zz();
            throw JsonDecodingException_0(-1, 'Expected ' + tmp_7 + ', but had ' + tmp_8 + ' as the serialized body of ' + serialName_0 + ' at element: ' + tmp$ret$3, toString(currentObject));
          }
          tmp_4 = new JsonTreeMapDecoder(tmp_6, currentObject);
        } else {
          if (this_0.q12_1.g14_1) {
            var tmp_9 = this.u14();
            // Inline function 'kotlinx.serialization.json.internal.AbstractJsonTreeDecoder.cast' call
            // Inline function 'kotlinx.serialization.json.internal.cast' call
            var serialName_1 = descriptor.uj();
            if (!(currentObject instanceof JsonArray)) {
              var tmp_10 = getKClass(JsonArray).z8();
              var tmp_11 = getKClassFromExpression(currentObject).z8();
              var tmp$ret$7 = this.zz();
              throw JsonDecodingException_0(-1, 'Expected ' + tmp_10 + ', but had ' + tmp_11 + ' as the serialized body of ' + serialName_1 + ' at element: ' + tmp$ret$7, toString(currentObject));
            }
            tmp_4 = new JsonTreeListDecoder(tmp_9, currentObject);
          } else {
            throw InvalidKeyKindException(keyDescriptor);
          }
        }
        tmp = tmp_4;
      } else {
        var tmp_12 = this.u14();
        // Inline function 'kotlinx.serialization.json.internal.AbstractJsonTreeDecoder.cast' call
        // Inline function 'kotlinx.serialization.json.internal.cast' call
        var serialName_2 = descriptor.uj();
        if (!(currentObject instanceof JsonObject)) {
          var tmp_13 = getKClass(JsonObject).z8();
          var tmp_14 = getKClassFromExpression(currentObject).z8();
          var tmp$ret$12 = this.zz();
          throw JsonDecodingException_0(-1, 'Expected ' + tmp_13 + ', but had ' + tmp_14 + ' as the serialized body of ' + serialName_2 + ' at element: ' + tmp$ret$12, toString(currentObject));
        }
        tmp = new JsonTreeDecoder(tmp_12, currentObject, this.x1a_1);
      }
    }
    return tmp;
  };
  protoOf(AbstractJsonTreeDecoder).sl = function (descriptor) {
  };
  protoOf(AbstractJsonTreeDecoder).cl = function () {
    var tmp = this.a1b();
    return !(tmp instanceof JsonNull);
  };
  protoOf(AbstractJsonTreeDecoder).c1b = function (tag, enumDescriptor) {
    var tmp = this.u14();
    // Inline function 'kotlinx.serialization.json.internal.AbstractJsonTreeDecoder.getPrimitiveValue' call
    var tmp1 = this.b1b(tag);
    // Inline function 'kotlinx.serialization.json.internal.AbstractJsonTreeDecoder.cast' call
    // Inline function 'kotlinx.serialization.json.internal.cast' call
    var serialName = enumDescriptor.uj();
    if (!(tmp1 instanceof JsonPrimitive)) {
      var tmp_0 = getKClass(JsonPrimitive).z8();
      var tmp_1 = getKClassFromExpression(tmp1).z8();
      var tmp$ret$0 = this.z1a(tag);
      throw JsonDecodingException_0(-1, 'Expected ' + tmp_0 + ', but had ' + tmp_1 + ' as the serialized body of ' + serialName + ' at element: ' + tmp$ret$0, toString(tmp1));
    }
    return getJsonNameIndexOrThrow(enumDescriptor, tmp, tmp1.a15());
  };
  protoOf(AbstractJsonTreeDecoder).l10 = function (tag, enumDescriptor) {
    return this.c1b((!(tag == null) ? typeof tag === 'string' : false) ? tag : THROW_CCE(), enumDescriptor);
  };
  protoOf(AbstractJsonTreeDecoder).d1b = function (tag) {
    return !(this.b1b(tag) === JsonNull_getInstance());
  };
  protoOf(AbstractJsonTreeDecoder).b10 = function (tag) {
    return this.d1b((!(tag == null) ? typeof tag === 'string' : false) ? tag : THROW_CCE());
  };
  protoOf(AbstractJsonTreeDecoder).e1b = function (tag) {
    var tmp$ret$4;
    $l$block: {
      // Inline function 'kotlinx.serialization.json.internal.AbstractJsonTreeDecoder.getPrimitiveValue' call
      // Inline function 'kotlinx.serialization.json.internal.AbstractJsonTreeDecoder.cast' call
      // Inline function 'kotlinx.serialization.json.internal.cast' call
      var value = this.b1b(tag);
      if (!(value instanceof JsonPrimitive)) {
        var tmp = getKClass(JsonPrimitive).z8();
        var tmp_0 = getKClassFromExpression(value).z8();
        var tmp$ret$0 = this.z1a(tag);
        throw JsonDecodingException_0(-1, 'Expected ' + tmp + ', but had ' + tmp_0 + ' as the serialized body of ' + 'boolean' + ' at element: ' + tmp$ret$0, toString(value));
      }
      var literal = value;
      try {
        var tmp0_elvis_lhs = get_booleanOrNull(literal);
        var tmp_1;
        if (tmp0_elvis_lhs == null) {
          unparsedPrimitive(this, literal, 'boolean', tag);
        } else {
          tmp_1 = tmp0_elvis_lhs;
        }
        tmp$ret$4 = tmp_1;
        break $l$block;
      } catch ($p) {
        if ($p instanceof IllegalArgumentException) {
          var e = $p;
          unparsedPrimitive(this, literal, 'boolean', tag);
        } else {
          throw $p;
        }
      }
    }
    return tmp$ret$4;
  };
  protoOf(AbstractJsonTreeDecoder).c10 = function (tag) {
    return this.e1b((!(tag == null) ? typeof tag === 'string' : false) ? tag : THROW_CCE());
  };
  protoOf(AbstractJsonTreeDecoder).f1b = function (tag) {
    var tmp$ret$4;
    $l$block: {
      // Inline function 'kotlinx.serialization.json.internal.AbstractJsonTreeDecoder.getPrimitiveValue' call
      // Inline function 'kotlinx.serialization.json.internal.AbstractJsonTreeDecoder.cast' call
      // Inline function 'kotlinx.serialization.json.internal.cast' call
      var value = this.b1b(tag);
      if (!(value instanceof JsonPrimitive)) {
        var tmp = getKClass(JsonPrimitive).z8();
        var tmp_0 = getKClassFromExpression(value).z8();
        var tmp$ret$0 = this.z1a(tag);
        throw JsonDecodingException_0(-1, 'Expected ' + tmp + ', but had ' + tmp_0 + ' as the serialized body of ' + 'byte' + ' at element: ' + tmp$ret$0, toString(value));
      }
      var literal = value;
      try {
        var result = get_int(literal);
        var tmp0_elvis_lhs = (-128 <= result ? result <= 127 : false) ? toByte(result) : null;
        var tmp_1;
        if (tmp0_elvis_lhs == null) {
          unparsedPrimitive(this, literal, 'byte', tag);
        } else {
          tmp_1 = tmp0_elvis_lhs;
        }
        tmp$ret$4 = tmp_1;
        break $l$block;
      } catch ($p) {
        if ($p instanceof IllegalArgumentException) {
          var e = $p;
          unparsedPrimitive(this, literal, 'byte', tag);
        } else {
          throw $p;
        }
      }
    }
    return tmp$ret$4;
  };
  protoOf(AbstractJsonTreeDecoder).d10 = function (tag) {
    return this.f1b((!(tag == null) ? typeof tag === 'string' : false) ? tag : THROW_CCE());
  };
  protoOf(AbstractJsonTreeDecoder).g1b = function (tag) {
    var tmp$ret$4;
    $l$block: {
      // Inline function 'kotlinx.serialization.json.internal.AbstractJsonTreeDecoder.getPrimitiveValue' call
      // Inline function 'kotlinx.serialization.json.internal.AbstractJsonTreeDecoder.cast' call
      // Inline function 'kotlinx.serialization.json.internal.cast' call
      var value = this.b1b(tag);
      if (!(value instanceof JsonPrimitive)) {
        var tmp = getKClass(JsonPrimitive).z8();
        var tmp_0 = getKClassFromExpression(value).z8();
        var tmp$ret$0 = this.z1a(tag);
        throw JsonDecodingException_0(-1, 'Expected ' + tmp + ', but had ' + tmp_0 + ' as the serialized body of ' + 'short' + ' at element: ' + tmp$ret$0, toString(value));
      }
      var literal = value;
      try {
        var result = get_int(literal);
        var tmp0_elvis_lhs = (-32768 <= result ? result <= 32767 : false) ? toShort(result) : null;
        var tmp_1;
        if (tmp0_elvis_lhs == null) {
          unparsedPrimitive(this, literal, 'short', tag);
        } else {
          tmp_1 = tmp0_elvis_lhs;
        }
        tmp$ret$4 = tmp_1;
        break $l$block;
      } catch ($p) {
        if ($p instanceof IllegalArgumentException) {
          var e = $p;
          unparsedPrimitive(this, literal, 'short', tag);
        } else {
          throw $p;
        }
      }
    }
    return tmp$ret$4;
  };
  protoOf(AbstractJsonTreeDecoder).e10 = function (tag) {
    return this.g1b((!(tag == null) ? typeof tag === 'string' : false) ? tag : THROW_CCE());
  };
  protoOf(AbstractJsonTreeDecoder).h1b = function (tag) {
    var tmp$ret$4;
    $l$block: {
      // Inline function 'kotlinx.serialization.json.internal.AbstractJsonTreeDecoder.getPrimitiveValue' call
      // Inline function 'kotlinx.serialization.json.internal.AbstractJsonTreeDecoder.cast' call
      // Inline function 'kotlinx.serialization.json.internal.cast' call
      var value = this.b1b(tag);
      if (!(value instanceof JsonPrimitive)) {
        var tmp = getKClass(JsonPrimitive).z8();
        var tmp_0 = getKClassFromExpression(value).z8();
        var tmp$ret$0 = this.z1a(tag);
        throw JsonDecodingException_0(-1, 'Expected ' + tmp + ', but had ' + tmp_0 + ' as the serialized body of ' + 'int' + ' at element: ' + tmp$ret$0, toString(value));
      }
      var literal = value;
      try {
        var tmp0_elvis_lhs = get_int(literal);
        var tmp_1;
        if (tmp0_elvis_lhs == null) {
          unparsedPrimitive(this, literal, 'int', tag);
        } else {
          tmp_1 = tmp0_elvis_lhs;
        }
        tmp$ret$4 = tmp_1;
        break $l$block;
      } catch ($p) {
        if ($p instanceof IllegalArgumentException) {
          var e = $p;
          unparsedPrimitive(this, literal, 'int', tag);
        } else {
          throw $p;
        }
      }
    }
    return tmp$ret$4;
  };
  protoOf(AbstractJsonTreeDecoder).f10 = function (tag) {
    return this.h1b((!(tag == null) ? typeof tag === 'string' : false) ? tag : THROW_CCE());
  };
  protoOf(AbstractJsonTreeDecoder).i1b = function (tag) {
    var tmp$ret$4;
    $l$block: {
      // Inline function 'kotlinx.serialization.json.internal.AbstractJsonTreeDecoder.getPrimitiveValue' call
      // Inline function 'kotlinx.serialization.json.internal.AbstractJsonTreeDecoder.cast' call
      // Inline function 'kotlinx.serialization.json.internal.cast' call
      var value = this.b1b(tag);
      if (!(value instanceof JsonPrimitive)) {
        var tmp = getKClass(JsonPrimitive).z8();
        var tmp_0 = getKClassFromExpression(value).z8();
        var tmp$ret$0 = this.z1a(tag);
        throw JsonDecodingException_0(-1, 'Expected ' + tmp + ', but had ' + tmp_0 + ' as the serialized body of ' + 'long' + ' at element: ' + tmp$ret$0, toString(value));
      }
      var literal = value;
      try {
        var tmp0_elvis_lhs = get_long(literal);
        var tmp_1;
        if (tmp0_elvis_lhs == null) {
          unparsedPrimitive(this, literal, 'long', tag);
        } else {
          tmp_1 = tmp0_elvis_lhs;
        }
        tmp$ret$4 = tmp_1;
        break $l$block;
      } catch ($p) {
        if ($p instanceof IllegalArgumentException) {
          var e = $p;
          unparsedPrimitive(this, literal, 'long', tag);
        } else {
          throw $p;
        }
      }
    }
    return tmp$ret$4;
  };
  protoOf(AbstractJsonTreeDecoder).g10 = function (tag) {
    return this.i1b((!(tag == null) ? typeof tag === 'string' : false) ? tag : THROW_CCE());
  };
  protoOf(AbstractJsonTreeDecoder).j1b = function (tag) {
    var tmp$ret$4;
    $l$block: {
      // Inline function 'kotlinx.serialization.json.internal.AbstractJsonTreeDecoder.getPrimitiveValue' call
      // Inline function 'kotlinx.serialization.json.internal.AbstractJsonTreeDecoder.cast' call
      // Inline function 'kotlinx.serialization.json.internal.cast' call
      var value = this.b1b(tag);
      if (!(value instanceof JsonPrimitive)) {
        var tmp = getKClass(JsonPrimitive).z8();
        var tmp_0 = getKClassFromExpression(value).z8();
        var tmp$ret$0 = this.z1a(tag);
        throw JsonDecodingException_0(-1, 'Expected ' + tmp + ', but had ' + tmp_0 + ' as the serialized body of ' + 'float' + ' at element: ' + tmp$ret$0, toString(value));
      }
      var literal = value;
      try {
        var tmp0_elvis_lhs = get_float(literal);
        var tmp_1;
        if (tmp0_elvis_lhs == null) {
          unparsedPrimitive(this, literal, 'float', tag);
        } else {
          tmp_1 = tmp0_elvis_lhs;
        }
        tmp$ret$4 = tmp_1;
        break $l$block;
      } catch ($p) {
        if ($p instanceof IllegalArgumentException) {
          var e = $p;
          unparsedPrimitive(this, literal, 'float', tag);
        } else {
          throw $p;
        }
      }
    }
    var result = tmp$ret$4;
    var specialFp = this.u14().q12_1.n14_1;
    if (specialFp || isFinite(result))
      return result;
    throw InvalidFloatingPointDecoded(result, tag, toString(this.a1b()));
  };
  protoOf(AbstractJsonTreeDecoder).h10 = function (tag) {
    return this.j1b((!(tag == null) ? typeof tag === 'string' : false) ? tag : THROW_CCE());
  };
  protoOf(AbstractJsonTreeDecoder).k1b = function (tag) {
    var tmp$ret$4;
    $l$block: {
      // Inline function 'kotlinx.serialization.json.internal.AbstractJsonTreeDecoder.getPrimitiveValue' call
      // Inline function 'kotlinx.serialization.json.internal.AbstractJsonTreeDecoder.cast' call
      // Inline function 'kotlinx.serialization.json.internal.cast' call
      var value = this.b1b(tag);
      if (!(value instanceof JsonPrimitive)) {
        var tmp = getKClass(JsonPrimitive).z8();
        var tmp_0 = getKClassFromExpression(value).z8();
        var tmp$ret$0 = this.z1a(tag);
        throw JsonDecodingException_0(-1, 'Expected ' + tmp + ', but had ' + tmp_0 + ' as the serialized body of ' + 'double' + ' at element: ' + tmp$ret$0, toString(value));
      }
      var literal = value;
      try {
        var tmp0_elvis_lhs = get_double(literal);
        var tmp_1;
        if (tmp0_elvis_lhs == null) {
          unparsedPrimitive(this, literal, 'double', tag);
        } else {
          tmp_1 = tmp0_elvis_lhs;
        }
        tmp$ret$4 = tmp_1;
        break $l$block;
      } catch ($p) {
        if ($p instanceof IllegalArgumentException) {
          var e = $p;
          unparsedPrimitive(this, literal, 'double', tag);
        } else {
          throw $p;
        }
      }
    }
    var result = tmp$ret$4;
    var specialFp = this.u14().q12_1.n14_1;
    if (specialFp || isFinite_0(result))
      return result;
    throw InvalidFloatingPointDecoded(result, tag, toString(this.a1b()));
  };
  protoOf(AbstractJsonTreeDecoder).i10 = function (tag) {
    return this.k1b((!(tag == null) ? typeof tag === 'string' : false) ? tag : THROW_CCE());
  };
  protoOf(AbstractJsonTreeDecoder).l1b = function (tag) {
    var tmp$ret$4;
    $l$block: {
      // Inline function 'kotlinx.serialization.json.internal.AbstractJsonTreeDecoder.getPrimitiveValue' call
      // Inline function 'kotlinx.serialization.json.internal.AbstractJsonTreeDecoder.cast' call
      // Inline function 'kotlinx.serialization.json.internal.cast' call
      var value = this.b1b(tag);
      if (!(value instanceof JsonPrimitive)) {
        var tmp = getKClass(JsonPrimitive).z8();
        var tmp_0 = getKClassFromExpression(value).z8();
        var tmp$ret$0 = this.z1a(tag);
        throw JsonDecodingException_0(-1, 'Expected ' + tmp + ', but had ' + tmp_0 + ' as the serialized body of ' + 'char' + ' at element: ' + tmp$ret$0, toString(value));
      }
      var literal = value;
      try {
        var tmp0_elvis_lhs = new Char(single(literal.a15()));
        var tmp_1;
        if (tmp0_elvis_lhs == null) {
          unparsedPrimitive(this, literal, 'char', tag);
        } else {
          tmp_1 = tmp0_elvis_lhs;
        }
        tmp$ret$4 = tmp_1.d1_1;
        break $l$block;
      } catch ($p) {
        if ($p instanceof IllegalArgumentException) {
          var e = $p;
          unparsedPrimitive(this, literal, 'char', tag);
        } else {
          throw $p;
        }
      }
    }
    return tmp$ret$4;
  };
  protoOf(AbstractJsonTreeDecoder).j10 = function (tag) {
    return this.l1b((!(tag == null) ? typeof tag === 'string' : false) ? tag : THROW_CCE());
  };
  protoOf(AbstractJsonTreeDecoder).m1b = function (tag) {
    // Inline function 'kotlinx.serialization.json.internal.AbstractJsonTreeDecoder.cast' call
    // Inline function 'kotlinx.serialization.json.internal.cast' call
    var value = this.b1b(tag);
    if (!(value instanceof JsonPrimitive)) {
      var tmp = getKClass(JsonPrimitive).z8();
      var tmp_0 = getKClassFromExpression(value).z8();
      var tmp$ret$0 = this.z1a(tag);
      throw JsonDecodingException_0(-1, 'Expected ' + tmp + ', but had ' + tmp_0 + ' as the serialized body of ' + 'string' + ' at element: ' + tmp$ret$0, toString(value));
    }
    var value_0 = value;
    if (!(value_0 instanceof JsonLiteral))
      throw JsonDecodingException_0(-1, "Expected string value for a non-null key '" + tag + "', got null literal instead at element: " + this.z1a(tag), toString(this.a1b()));
    if (!value_0.d15_1 && !this.u14().q12_1.f14_1) {
      throw JsonDecodingException_0(-1, "String literal for key '" + tag + "' should be quoted at element: " + this.z1a(tag) + ".\nUse 'isLenient = true' in 'Json {}' builder to accept non-compliant JSON.", toString(this.a1b()));
    }
    return value_0.f15_1;
  };
  protoOf(AbstractJsonTreeDecoder).k10 = function (tag) {
    return this.m1b((!(tag == null) ? typeof tag === 'string' : false) ? tag : THROW_CCE());
  };
  protoOf(AbstractJsonTreeDecoder).n1b = function (tag, inlineDescriptor) {
    var tmp;
    if (get_isUnsignedNumber(inlineDescriptor)) {
      var tmp_0 = this.u14();
      // Inline function 'kotlinx.serialization.json.internal.AbstractJsonTreeDecoder.getPrimitiveValue' call
      var tmp1 = this.b1b(tag);
      // Inline function 'kotlinx.serialization.json.internal.AbstractJsonTreeDecoder.cast' call
      // Inline function 'kotlinx.serialization.json.internal.cast' call
      var serialName = inlineDescriptor.uj();
      if (!(tmp1 instanceof JsonPrimitive)) {
        var tmp_1 = getKClass(JsonPrimitive).z8();
        var tmp_2 = getKClassFromExpression(tmp1).z8();
        var tmp$ret$0 = this.z1a(tag);
        throw JsonDecodingException_0(-1, 'Expected ' + tmp_1 + ', but had ' + tmp_2 + ' as the serialized body of ' + serialName + ' at element: ' + tmp$ret$0, toString(tmp1));
      }
      var lexer = StringJsonLexer_0(tmp_0, tmp1.a15());
      tmp = new JsonDecoderForUnsignedTypes(lexer, this.u14());
    } else {
      tmp = protoOf(NamedValueDecoder).m10.call(this, tag, inlineDescriptor);
    }
    return tmp;
  };
  protoOf(AbstractJsonTreeDecoder).m10 = function (tag, inlineDescriptor) {
    return this.n1b((!(tag == null) ? typeof tag === 'string' : false) ? tag : THROW_CCE(), inlineDescriptor);
  };
  protoOf(AbstractJsonTreeDecoder).ol = function (descriptor) {
    return !(this.xz() == null) ? protoOf(NamedValueDecoder).ol.call(this, descriptor) : (new JsonPrimitiveDecoder(this.u14(), this.s1(), this.x1a_1)).ol(descriptor);
  };
  function coerceInputValue_0($this, descriptor, index, tag) {
    var tmp0 = $this.u14();
    var tmp$ret$1;
    $l$block_2: {
      // Inline function 'kotlinx.serialization.json.internal.tryCoerceValue' call
      var isOptional = descriptor.dk(index);
      var elementDescriptor = descriptor.ck(index);
      var tmp;
      if (isOptional && !elementDescriptor.qj()) {
        var tmp_0 = $this.b1b(tag);
        tmp = tmp_0 instanceof JsonNull;
      } else {
        tmp = false;
      }
      if (tmp) {
        tmp$ret$1 = true;
        break $l$block_2;
      }
      if (equals(elementDescriptor.vj(), ENUM_getInstance())) {
        var tmp_1;
        if (elementDescriptor.qj()) {
          var tmp_2 = $this.b1b(tag);
          tmp_1 = tmp_2 instanceof JsonNull;
        } else {
          tmp_1 = false;
        }
        if (tmp_1) {
          tmp$ret$1 = false;
          break $l$block_2;
        }
        var tmp_3 = $this.b1b(tag);
        var tmp0_safe_receiver = tmp_3 instanceof JsonPrimitive ? tmp_3 : null;
        var tmp0_elvis_lhs = tmp0_safe_receiver == null ? null : get_contentOrNull(tmp0_safe_receiver);
        var tmp_4;
        if (tmp0_elvis_lhs == null) {
          tmp$ret$1 = false;
          break $l$block_2;
        } else {
          tmp_4 = tmp0_elvis_lhs;
        }
        var enumValue = tmp_4;
        var enumIndex = getJsonNameIndex(elementDescriptor, tmp0, enumValue);
        var coerceToNull = !tmp0.q12_1.i14_1 && elementDescriptor.qj();
        if (enumIndex === -3 && (isOptional || coerceToNull)) {
          tmp$ret$1 = true;
          break $l$block_2;
        }
      }
      tmp$ret$1 = false;
    }
    return tmp$ret$1;
  }
  function absenceIsNull($this, descriptor, index) {
    $this.x1b_1 = (!$this.u14().q12_1.i14_1 && !descriptor.dk(index) && descriptor.ck(index).qj());
    return $this.x1b_1;
  }
  function JsonTreeDecoder(json, value, polymorphicDiscriminator, polyDescriptor) {
    polymorphicDiscriminator = polymorphicDiscriminator === VOID ? null : polymorphicDiscriminator;
    polyDescriptor = polyDescriptor === VOID ? null : polyDescriptor;
    AbstractJsonTreeDecoder.call(this, json, value, polymorphicDiscriminator);
    this.u1b_1 = value;
    this.v1b_1 = polyDescriptor;
    this.w1b_1 = 0;
    this.x1b_1 = false;
  }
  protoOf(JsonTreeDecoder).s1 = function () {
    return this.u1b_1;
  };
  protoOf(JsonTreeDecoder).im = function (descriptor) {
    while (this.w1b_1 < descriptor.xj()) {
      var _unary__edvuaz = this.w1b_1;
      this.w1b_1 = _unary__edvuaz + 1 | 0;
      var name = this.sz(descriptor, _unary__edvuaz);
      var index = this.w1b_1 - 1 | 0;
      this.x1b_1 = false;
      var tmp;
      var tmp_0;
      // Inline function 'kotlin.collections.contains' call
      // Inline function 'kotlin.collections.containsKey' call
      var this_0 = this.s1();
      if ((isInterface(this_0, KtMap) ? this_0 : THROW_CCE()).t1(name)) {
        tmp_0 = true;
      } else {
        tmp_0 = absenceIsNull(this, descriptor, index);
      }
      if (tmp_0) {
        tmp = !this.y1a_1.k14_1 || !coerceInputValue_0(this, descriptor, index, name);
      } else {
        tmp = false;
      }
      if (tmp) {
        return index;
      }
    }
    return -1;
  };
  protoOf(JsonTreeDecoder).cl = function () {
    return !this.x1b_1 && protoOf(AbstractJsonTreeDecoder).cl.call(this);
  };
  protoOf(JsonTreeDecoder).tz = function (descriptor, index) {
    var strategy = namingStrategy(descriptor, this.u14());
    var baseName = descriptor.zj(index);
    if (strategy == null) {
      if (!this.y1a_1.o14_1)
        return baseName;
      if (this.s1().w1().p1(baseName))
        return baseName;
    }
    var deserializationNamesMap_0 = deserializationNamesMap(this.u14(), descriptor);
    // Inline function 'kotlin.collections.find' call
    var tmp0 = this.s1().w1();
    var tmp$ret$1;
    $l$block: {
      // Inline function 'kotlin.collections.firstOrNull' call
      var _iterator__ex2g4s = tmp0.g();
      while (_iterator__ex2g4s.h()) {
        var element = _iterator__ex2g4s.i();
        if (deserializationNamesMap_0.v1(element) === index) {
          tmp$ret$1 = element;
          break $l$block;
        }
      }
      tmp$ret$1 = null;
    }
    var tmp0_safe_receiver = tmp$ret$1;
    if (tmp0_safe_receiver == null)
      null;
    else {
      // Inline function 'kotlin.let' call
      return tmp0_safe_receiver;
    }
    var fallbackName = strategy == null ? null : strategy.o17(descriptor, index, baseName);
    return fallbackName == null ? baseName : fallbackName;
  };
  protoOf(JsonTreeDecoder).b1b = function (tag) {
    return getValue(this.s1(), tag);
  };
  protoOf(JsonTreeDecoder).rl = function (descriptor) {
    if (descriptor === this.v1b_1) {
      var tmp = this.u14();
      var tmp1 = this.a1b();
      // Inline function 'kotlinx.serialization.json.internal.AbstractJsonTreeDecoder.cast' call
      // Inline function 'kotlinx.serialization.json.internal.cast' call
      var serialName = this.v1b_1.uj();
      if (!(tmp1 instanceof JsonObject)) {
        var tmp_0 = getKClass(JsonObject).z8();
        var tmp_1 = getKClassFromExpression(tmp1).z8();
        var tmp$ret$0 = this.zz();
        throw JsonDecodingException_0(-1, 'Expected ' + tmp_0 + ', but had ' + tmp_1 + ' as the serialized body of ' + serialName + ' at element: ' + tmp$ret$0, toString(tmp1));
      }
      return new JsonTreeDecoder(tmp, tmp1, this.x1a_1, this.v1b_1);
    }
    return protoOf(AbstractJsonTreeDecoder).rl.call(this, descriptor);
  };
  protoOf(JsonTreeDecoder).sl = function (descriptor) {
    var tmp;
    if (this.y1a_1.e14_1) {
      tmp = true;
    } else {
      var tmp_0 = descriptor.vj();
      tmp = tmp_0 instanceof PolymorphicKind;
    }
    if (tmp)
      return Unit_instance;
    var strategy = namingStrategy(descriptor, this.u14());
    var tmp_1;
    if (strategy == null && !this.y1a_1.o14_1) {
      tmp_1 = jsonCachedSerialNames(descriptor);
    } else if (!(strategy == null)) {
      tmp_1 = deserializationNamesMap(this.u14(), descriptor).w1();
    } else {
      var tmp_2 = jsonCachedSerialNames(descriptor);
      var tmp0_safe_receiver = get_schemaCache(this.u14()).a1a(descriptor, get_JsonDeserializationNamesKey());
      // Inline function 'kotlin.collections.orEmpty' call
      var tmp0_elvis_lhs = tmp0_safe_receiver == null ? null : tmp0_safe_receiver.w1();
      var tmp$ret$0 = tmp0_elvis_lhs == null ? emptySet() : tmp0_elvis_lhs;
      tmp_1 = plus_0(tmp_2, tmp$ret$0);
    }
    var names = tmp_1;
    var _iterator__ex2g4s = this.s1().w1().g();
    while (_iterator__ex2g4s.h()) {
      var key = _iterator__ex2g4s.i();
      if (!names.p1(key) && !(key === this.x1a_1)) {
        throw UnknownKeyException(key, this.s1().toString());
      }
    }
  };
  function JsonTreeListDecoder(json, value) {
    AbstractJsonTreeDecoder.call(this, json, value);
    this.e1c_1 = value;
    this.f1c_1 = this.e1c_1.j();
    this.g1c_1 = -1;
  }
  protoOf(JsonTreeListDecoder).s1 = function () {
    return this.e1c_1;
  };
  protoOf(JsonTreeListDecoder).tz = function (descriptor, index) {
    return index.toString();
  };
  protoOf(JsonTreeListDecoder).b1b = function (tag) {
    return this.e1c_1.k(toInt(tag));
  };
  protoOf(JsonTreeListDecoder).im = function (descriptor) {
    while (this.g1c_1 < (this.f1c_1 - 1 | 0)) {
      this.g1c_1 = this.g1c_1 + 1 | 0;
      return this.g1c_1;
    }
    return -1;
  };
  function JsonPrimitiveDecoder(json, value, polymorphicDiscriminator) {
    polymorphicDiscriminator = polymorphicDiscriminator === VOID ? null : polymorphicDiscriminator;
    AbstractJsonTreeDecoder.call(this, json, value, polymorphicDiscriminator);
    this.n1c_1 = value;
    this.n10('primitive');
  }
  protoOf(JsonPrimitiveDecoder).s1 = function () {
    return this.n1c_1;
  };
  protoOf(JsonPrimitiveDecoder).im = function (descriptor) {
    return 0;
  };
  protoOf(JsonPrimitiveDecoder).b1b = function (tag) {
    // Inline function 'kotlin.require' call
    if (!(tag === 'primitive')) {
      var message = "This input can only handle primitives with 'primitive' tag";
      throw IllegalArgumentException_init_$Create$(toString(message));
    }
    return this.n1c_1;
  };
  function JsonTreeMapDecoder(json, value) {
    JsonTreeDecoder.call(this, json, value);
    this.y1c_1 = value;
    this.z1c_1 = toList(this.y1c_1.w1());
    this.a1d_1 = imul(this.z1c_1.j(), 2);
    this.b1d_1 = -1;
  }
  protoOf(JsonTreeMapDecoder).s1 = function () {
    return this.y1c_1;
  };
  protoOf(JsonTreeMapDecoder).tz = function (descriptor, index) {
    var i = index / 2 | 0;
    return this.z1c_1.k(i);
  };
  protoOf(JsonTreeMapDecoder).im = function (descriptor) {
    while (this.b1d_1 < (this.a1d_1 - 1 | 0)) {
      this.b1d_1 = this.b1d_1 + 1 | 0;
      return this.b1d_1;
    }
    return -1;
  };
  protoOf(JsonTreeMapDecoder).b1b = function (tag) {
    return (this.b1d_1 % 2 | 0) === 0 ? JsonPrimitive_1(tag) : getValue(this.y1c_1, tag);
  };
  protoOf(JsonTreeMapDecoder).sl = function (descriptor) {
  };
  function readPolymorphicJson(_this__u8e3s4, discriminator, element, deserializer) {
    return (new JsonTreeDecoder(_this__u8e3s4, element, discriminator, deserializer.qi())).ql(deserializer);
  }
  var WriteMode_OBJ_instance;
  var WriteMode_LIST_instance;
  var WriteMode_MAP_instance;
  var WriteMode_POLY_OBJ_instance;
  function values() {
    return [WriteMode_OBJ_getInstance(), WriteMode_LIST_getInstance(), WriteMode_MAP_getInstance(), WriteMode_POLY_OBJ_getInstance()];
  }
  function get_entries() {
    if ($ENTRIES == null)
      $ENTRIES = enumEntries(values());
    return $ENTRIES;
  }
  var WriteMode_entriesInitialized;
  function WriteMode_initEntries() {
    if (WriteMode_entriesInitialized)
      return Unit_instance;
    WriteMode_entriesInitialized = true;
    WriteMode_OBJ_instance = new WriteMode('OBJ', 0, _Char___init__impl__6a9atx(123), _Char___init__impl__6a9atx(125));
    WriteMode_LIST_instance = new WriteMode('LIST', 1, _Char___init__impl__6a9atx(91), _Char___init__impl__6a9atx(93));
    WriteMode_MAP_instance = new WriteMode('MAP', 2, _Char___init__impl__6a9atx(123), _Char___init__impl__6a9atx(125));
    WriteMode_POLY_OBJ_instance = new WriteMode('POLY_OBJ', 3, _Char___init__impl__6a9atx(91), _Char___init__impl__6a9atx(93));
  }
  var $ENTRIES;
  function WriteMode(name, ordinal, begin, end) {
    Enum.call(this, name, ordinal);
    this.n1a_1 = begin;
    this.o1a_1 = end;
  }
  function switchMode(_this__u8e3s4, desc) {
    var tmp0_subject = desc.vj();
    var tmp;
    if (tmp0_subject instanceof PolymorphicKind) {
      tmp = WriteMode_POLY_OBJ_getInstance();
    } else {
      if (equals(tmp0_subject, LIST_getInstance())) {
        tmp = WriteMode_LIST_getInstance();
      } else {
        if (equals(tmp0_subject, MAP_getInstance())) {
          // Inline function 'kotlinx.serialization.json.internal.selectMapMode' call
          var keyDescriptor = carrierDescriptor(desc.ck(0), _this__u8e3s4.gm());
          var keyKind = keyDescriptor.vj();
          var tmp_0;
          var tmp_1;
          if (keyKind instanceof PrimitiveKind) {
            tmp_1 = true;
          } else {
            tmp_1 = equals(keyKind, ENUM_getInstance());
          }
          if (tmp_1) {
            tmp_0 = WriteMode_MAP_getInstance();
          } else {
            if (_this__u8e3s4.q12_1.g14_1) {
              tmp_0 = WriteMode_LIST_getInstance();
            } else {
              throw InvalidKeyKindException(keyDescriptor);
            }
          }
          tmp = tmp_0;
        } else {
          tmp = WriteMode_OBJ_getInstance();
        }
      }
    }
    return tmp;
  }
  function carrierDescriptor(_this__u8e3s4, module_0) {
    var tmp;
    if (equals(_this__u8e3s4.vj(), CONTEXTUAL_getInstance())) {
      var tmp0_safe_receiver = getContextualDescriptor(module_0, _this__u8e3s4);
      var tmp1_elvis_lhs = tmp0_safe_receiver == null ? null : carrierDescriptor(tmp0_safe_receiver, module_0);
      tmp = tmp1_elvis_lhs == null ? _this__u8e3s4 : tmp1_elvis_lhs;
    } else if (_this__u8e3s4.wj()) {
      tmp = carrierDescriptor(_this__u8e3s4.ck(0), module_0);
    } else {
      tmp = _this__u8e3s4;
    }
    return tmp;
  }
  function WriteMode_OBJ_getInstance() {
    WriteMode_initEntries();
    return WriteMode_OBJ_instance;
  }
  function WriteMode_LIST_getInstance() {
    WriteMode_initEntries();
    return WriteMode_LIST_instance;
  }
  function WriteMode_MAP_getInstance() {
    WriteMode_initEntries();
    return WriteMode_MAP_instance;
  }
  function WriteMode_POLY_OBJ_getInstance() {
    WriteMode_initEntries();
    return WriteMode_POLY_OBJ_instance;
  }
  function appendEscape($this, lastPosition, current) {
    $this.c1d(lastPosition, current);
    return appendEsc($this, current + 1 | 0);
  }
  function decodedString($this, lastPosition, currentPosition) {
    $this.c1d(lastPosition, currentPosition);
    var result = $this.i13_1.toString();
    $this.i13_1.qa(0);
    return result;
  }
  function takePeeked($this) {
    // Inline function 'kotlin.also' call
    var this_0 = ensureNotNull($this.h13_1);
    $this.h13_1 = null;
    return this_0;
  }
  function wasUnquotedString($this) {
    return !(charSequenceGet($this.d1d(), $this.f13_1 - 1 | 0) === _Char___init__impl__6a9atx(34));
  }
  function appendEsc($this, startPosition) {
    var currentPosition = startPosition;
    currentPosition = $this.e1d(currentPosition);
    if (currentPosition === -1) {
      $this.k17('Expected escape sequence to continue, got EOF');
    }
    var tmp = $this.d1d();
    var _unary__edvuaz = currentPosition;
    currentPosition = _unary__edvuaz + 1 | 0;
    var currentChar = charSequenceGet(tmp, _unary__edvuaz);
    if (currentChar === _Char___init__impl__6a9atx(117)) {
      return appendHex($this, $this.d1d(), currentPosition);
    }
    // Inline function 'kotlin.code' call
    var tmp$ret$0 = Char__toInt_impl_vasixd(currentChar);
    var c = escapeToChar(tmp$ret$0);
    if (c === _Char___init__impl__6a9atx(0)) {
      $this.k17("Invalid escaped char '" + toString_1(currentChar) + "'");
    }
    $this.i13_1.g7(c);
    return currentPosition;
  }
  function appendHex($this, source, startPos) {
    if ((startPos + 4 | 0) >= charSequenceLength(source)) {
      $this.f13_1 = startPos;
      $this.f1d();
      if (($this.f13_1 + 4 | 0) >= charSequenceLength(source)) {
        $this.k17('Unexpected EOF during unicode escape');
      }
      return appendHex($this, source, $this.f13_1);
    }
    $this.i13_1.g7(numberToChar((((fromHexChar($this, source, startPos) << 12) + (fromHexChar($this, source, startPos + 1 | 0) << 8) | 0) + (fromHexChar($this, source, startPos + 2 | 0) << 4) | 0) + fromHexChar($this, source, startPos + 3 | 0) | 0));
    return startPos + 4 | 0;
  }
  function fromHexChar($this, source, currentPosition) {
    var character = charSequenceGet(source, currentPosition);
    var tmp;
    if (_Char___init__impl__6a9atx(48) <= character ? character <= _Char___init__impl__6a9atx(57) : false) {
      // Inline function 'kotlin.code' call
      var tmp_0 = Char__toInt_impl_vasixd(character);
      // Inline function 'kotlin.code' call
      var this_0 = _Char___init__impl__6a9atx(48);
      tmp = tmp_0 - Char__toInt_impl_vasixd(this_0) | 0;
    } else if (_Char___init__impl__6a9atx(97) <= character ? character <= _Char___init__impl__6a9atx(102) : false) {
      // Inline function 'kotlin.code' call
      var tmp_1 = Char__toInt_impl_vasixd(character);
      // Inline function 'kotlin.code' call
      var this_1 = _Char___init__impl__6a9atx(97);
      tmp = (tmp_1 - Char__toInt_impl_vasixd(this_1) | 0) + 10 | 0;
    } else if (_Char___init__impl__6a9atx(65) <= character ? character <= _Char___init__impl__6a9atx(70) : false) {
      // Inline function 'kotlin.code' call
      var tmp_2 = Char__toInt_impl_vasixd(character);
      // Inline function 'kotlin.code' call
      var this_2 = _Char___init__impl__6a9atx(65);
      tmp = (tmp_2 - Char__toInt_impl_vasixd(this_2) | 0) + 10 | 0;
    } else {
      $this.k17("Invalid toHexChar char '" + toString_1(character) + "' in unicode escape");
    }
    return tmp;
  }
  function consumeBoolean2($this, start) {
    var current = $this.e1d(start);
    if (current >= charSequenceLength($this.d1d()) || current === -1) {
      $this.k17('EOF');
    }
    var tmp = $this.d1d();
    var _unary__edvuaz = current;
    current = _unary__edvuaz + 1 | 0;
    // Inline function 'kotlin.code' call
    var this_0 = charSequenceGet(tmp, _unary__edvuaz);
    var tmp0_subject = Char__toInt_impl_vasixd(this_0) | 32;
    var tmp_0;
    // Inline function 'kotlin.code' call
    var this_1 = _Char___init__impl__6a9atx(116);
    if (tmp0_subject === Char__toInt_impl_vasixd(this_1)) {
      consumeBooleanLiteral($this, 'rue', current);
      tmp_0 = true;
    } else {
      // Inline function 'kotlin.code' call
      var this_2 = _Char___init__impl__6a9atx(102);
      if (tmp0_subject === Char__toInt_impl_vasixd(this_2)) {
        consumeBooleanLiteral($this, 'alse', current);
        tmp_0 = false;
      } else {
        $this.k17("Expected valid boolean literal prefix, but had '" + $this.p18() + "'");
      }
    }
    return tmp_0;
  }
  function consumeBooleanLiteral($this, literalSuffix, current) {
    if ((charSequenceLength($this.d1d()) - current | 0) < literalSuffix.length) {
      $this.k17('Unexpected end of boolean literal');
    }
    var inductionVariable = 0;
    var last = charSequenceLength(literalSuffix) - 1 | 0;
    if (inductionVariable <= last)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        var expected = charSequenceGet(literalSuffix, i);
        var actual = charSequenceGet($this.d1d(), current + i | 0);
        // Inline function 'kotlin.code' call
        var tmp = Char__toInt_impl_vasixd(expected);
        // Inline function 'kotlin.code' call
        if (!(tmp === (Char__toInt_impl_vasixd(actual) | 32))) {
          $this.k17("Expected valid boolean literal prefix, but had '" + $this.p18() + "'");
        }
      }
       while (inductionVariable <= last);
    $this.f13_1 = current + literalSuffix.length | 0;
  }
  function consumeNumericLiteral$calculateExponent(exponentAccumulator, isExponentPositive) {
    var tmp;
    switch (isExponentPositive) {
      case false:
        // Inline function 'kotlin.math.pow' call

        var x = -exponentAccumulator.z2();
        tmp = Math.pow(10.0, x);
        break;
      case true:
        // Inline function 'kotlin.math.pow' call

        var x_0 = exponentAccumulator.z2();
        tmp = Math.pow(10.0, x_0);
        break;
      default:
        noWhenBranchMatchedException();
        break;
    }
    return tmp;
  }
  function AbstractJsonLexer() {
    this.f13_1 = 0;
    this.g13_1 = new JsonPath();
    this.h13_1 = null;
    this.i13_1 = StringBuilder_init_$Create$();
  }
  protoOf(AbstractJsonLexer).f1d = function () {
  };
  protoOf(AbstractJsonLexer).d1a = function () {
    var current = this.g1d();
    var source = this.d1d();
    if (current >= charSequenceLength(source) || current === -1)
      return false;
    if (charSequenceGet(source, current) === _Char___init__impl__6a9atx(44)) {
      this.f13_1 = this.f13_1 + 1 | 0;
      return true;
    }
    return false;
  };
  protoOf(AbstractJsonLexer).h1d = function (c) {
    return c === _Char___init__impl__6a9atx(125) || c === _Char___init__impl__6a9atx(93) || (c === _Char___init__impl__6a9atx(58) || c === _Char___init__impl__6a9atx(44)) ? false : true;
  };
  protoOf(AbstractJsonLexer).j13 = function () {
    var nextToken = this.r18();
    if (!(nextToken === 10)) {
      this.k17('Expected EOF after parsing, but had ' + toString_1(charSequenceGet(this.d1d(), this.f13_1 - 1 | 0)) + ' instead');
    }
  };
  protoOf(AbstractJsonLexer).l18 = function (expected) {
    var token = this.r18();
    if (!(token === expected)) {
      this.i1d(expected);
    }
    return token;
  };
  protoOf(AbstractJsonLexer).j1d = function (expected) {
    if (this.f13_1 > 0 && expected === _Char___init__impl__6a9atx(34)) {
      var tmp$ret$1;
      $l$block: {
        // Inline function 'kotlinx.serialization.json.internal.AbstractJsonLexer.withPositionRollback' call
        var snapshot = this.f13_1;
        try {
          this.f13_1 = this.f13_1 - 1 | 0;
          tmp$ret$1 = this.p18();
          break $l$block;
        }finally {
          this.f13_1 = snapshot;
        }
      }
      var inputLiteral = tmp$ret$1;
      if (inputLiteral === 'null') {
        this.j17("Expected string literal but 'null' literal was found", this.f13_1 - 1 | 0, "Use 'coerceInputValues = true' in 'Json {}' builder to coerce nulls if property has a default value.");
      }
    }
    this.i1d(charToTokenClass(expected));
  };
  protoOf(AbstractJsonLexer).k1d = function (expectedToken, wasConsumed) {
    var expected = tokenDescription(expectedToken);
    var position = wasConsumed ? this.f13_1 - 1 | 0 : this.f13_1;
    var s = this.f13_1 === charSequenceLength(this.d1d()) || position < 0 ? 'EOF' : toString_1(charSequenceGet(this.d1d(), position));
    this.k17('Expected ' + expected + ", but had '" + s + "' instead", position);
  };
  protoOf(AbstractJsonLexer).i1d = function (expectedToken, wasConsumed, $super) {
    wasConsumed = wasConsumed === VOID ? true : wasConsumed;
    return $super === VOID ? this.k1d(expectedToken, wasConsumed) : $super.k1d.call(this, expectedToken, wasConsumed);
  };
  protoOf(AbstractJsonLexer).m18 = function () {
    var source = this.d1d();
    var cpos = this.f13_1;
    $l$loop_0: while (true) {
      cpos = this.e1d(cpos);
      if (cpos === -1)
        break $l$loop_0;
      var ch = charSequenceGet(source, cpos);
      if (ch === _Char___init__impl__6a9atx(32) || ch === _Char___init__impl__6a9atx(10) || ch === _Char___init__impl__6a9atx(13) || ch === _Char___init__impl__6a9atx(9)) {
        cpos = cpos + 1 | 0;
        continue $l$loop_0;
      }
      this.f13_1 = cpos;
      return charToTokenClass(ch);
    }
    this.f13_1 = cpos;
    return 10;
  };
  protoOf(AbstractJsonLexer).e1a = function (doConsume) {
    var current = this.g1d();
    current = this.e1d(current);
    var len = charSequenceLength(this.d1d()) - current | 0;
    if (len < 4 || current === -1)
      return false;
    var inductionVariable = 0;
    if (inductionVariable <= 3)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        if (!(charSequenceGet('null', i) === charSequenceGet(this.d1d(), current + i | 0)))
          return false;
      }
       while (inductionVariable <= 3);
    if (len > 4 && charToTokenClass(charSequenceGet(this.d1d(), current + 4 | 0)) === 0)
      return false;
    if (doConsume) {
      this.f13_1 = current + 4 | 0;
    }
    return true;
  };
  protoOf(AbstractJsonLexer).p1a = function (doConsume, $super) {
    doConsume = doConsume === VOID ? true : doConsume;
    return $super === VOID ? this.e1a(doConsume) : $super.e1a.call(this, doConsume);
  };
  protoOf(AbstractJsonLexer).f1a = function (isLenient) {
    var token = this.m18();
    var tmp;
    if (isLenient) {
      if (!(token === 1) && !(token === 0))
        return null;
      tmp = this.p18();
    } else {
      if (!(token === 1))
        return null;
      tmp = this.o18();
    }
    var string = tmp;
    this.h13_1 = string;
    return string;
  };
  protoOf(AbstractJsonLexer).l1d = function () {
    this.h13_1 = null;
  };
  protoOf(AbstractJsonLexer).m1d = function (startPos, endPos) {
    // Inline function 'kotlin.text.substring' call
    var this_0 = this.d1d();
    return toString(charSequenceSubSequence(this_0, startPos, endPos));
  };
  protoOf(AbstractJsonLexer).o18 = function () {
    if (!(this.h13_1 == null)) {
      return takePeeked(this);
    }
    return this.i1a();
  };
  protoOf(AbstractJsonLexer).consumeString2 = function (source, startPosition, current) {
    var currentPosition = current;
    var lastPosition = startPosition;
    var char = charSequenceGet(source, currentPosition);
    var usedAppend = false;
    while (!(char === _Char___init__impl__6a9atx(34))) {
      if (char === _Char___init__impl__6a9atx(92)) {
        usedAppend = true;
        currentPosition = this.e1d(appendEscape(this, lastPosition, currentPosition));
        if (currentPosition === -1) {
          this.k17('Unexpected EOF', currentPosition);
        }
        lastPosition = currentPosition;
      } else {
        currentPosition = currentPosition + 1 | 0;
        if (currentPosition >= charSequenceLength(source)) {
          usedAppend = true;
          this.c1d(lastPosition, currentPosition);
          currentPosition = this.e1d(currentPosition);
          if (currentPosition === -1) {
            this.k17('Unexpected EOF', currentPosition);
          }
          lastPosition = currentPosition;
        }
      }
      char = charSequenceGet(source, currentPosition);
    }
    var tmp;
    if (!usedAppend) {
      tmp = this.m1d(lastPosition, currentPosition);
    } else {
      tmp = decodedString(this, lastPosition, currentPosition);
    }
    var string = tmp;
    this.f13_1 = currentPosition + 1 | 0;
    return string;
  };
  protoOf(AbstractJsonLexer).j1a = function () {
    var result = this.p18();
    if (result === 'null' && wasUnquotedString(this)) {
      this.k17("Unexpected 'null' value instead of string literal");
    }
    return result;
  };
  protoOf(AbstractJsonLexer).p18 = function () {
    if (!(this.h13_1 == null)) {
      return takePeeked(this);
    }
    var current = this.g1d();
    if (current >= charSequenceLength(this.d1d()) || current === -1) {
      this.k17('EOF', current);
    }
    var token = charToTokenClass(charSequenceGet(this.d1d(), current));
    if (token === 1) {
      return this.o18();
    }
    if (!(token === 0)) {
      this.k17('Expected beginning of the string, but got ' + toString_1(charSequenceGet(this.d1d(), current)));
    }
    var usedAppend = false;
    while (charToTokenClass(charSequenceGet(this.d1d(), current)) === 0) {
      current = current + 1 | 0;
      if (current >= charSequenceLength(this.d1d())) {
        usedAppend = true;
        this.c1d(this.f13_1, current);
        var eof = this.e1d(current);
        if (eof === -1) {
          this.f13_1 = current;
          return decodedString(this, 0, 0);
        } else {
          current = eof;
        }
      }
    }
    var tmp;
    if (!usedAppend) {
      tmp = this.m1d(this.f13_1, current);
    } else {
      tmp = decodedString(this, this.f13_1, current);
    }
    var result = tmp;
    this.f13_1 = current;
    return result;
  };
  protoOf(AbstractJsonLexer).c1d = function (fromIndex, toIndex) {
    this.i13_1.ka(this.d1d(), fromIndex, toIndex);
  };
  protoOf(AbstractJsonLexer).h1a = function (allowLenientStrings) {
    // Inline function 'kotlin.collections.mutableListOf' call
    var tokenStack = ArrayList_init_$Create$();
    var lastToken = this.m18();
    if (!(lastToken === 8) && !(lastToken === 6)) {
      this.p18();
      return Unit_instance;
    }
    $l$loop: while (true) {
      lastToken = this.m18();
      if (lastToken === 1) {
        if (allowLenientStrings)
          this.p18();
        else
          this.i1a();
        continue $l$loop;
      }
      var tmp0_subject = lastToken;
      if (tmp0_subject === 8 || tmp0_subject === 6) {
        tokenStack.e(lastToken);
      } else if (tmp0_subject === 9) {
        if (!(last(tokenStack) === 8))
          throw JsonDecodingException_0(this.f13_1, 'found ] instead of } at path: ' + this.g13_1.toString(), this.d1d());
        removeLast(tokenStack);
      } else if (tmp0_subject === 7) {
        if (!(last(tokenStack) === 6))
          throw JsonDecodingException_0(this.f13_1, 'found } instead of ] at path: ' + this.g13_1.toString(), this.d1d());
        removeLast(tokenStack);
      } else if (tmp0_subject === 10) {
        this.k17('Unexpected end of input due to malformed JSON during ignoring unknown keys');
      }
      this.r18();
      if (tokenStack.j() === 0)
        return Unit_instance;
    }
  };
  protoOf(AbstractJsonLexer).toString = function () {
    return "JsonReader(source='" + toString(this.d1d()) + "', currentPosition=" + this.f13_1 + ')';
  };
  protoOf(AbstractJsonLexer).g1a = function (key) {
    var processed = this.m1d(0, this.f13_1);
    var lastIndexOf_0 = lastIndexOf(processed, key);
    this.j17("Encountered an unknown key '" + key + "'", lastIndexOf_0, "Use 'ignoreUnknownKeys = true' in 'Json {}' builder to ignore unknown keys.");
  };
  protoOf(AbstractJsonLexer).j17 = function (message, position, hint) {
    var tmp;
    // Inline function 'kotlin.text.isEmpty' call
    if (charSequenceLength(hint) === 0) {
      tmp = '';
    } else {
      tmp = '\n' + hint;
    }
    var hintMessage = tmp;
    throw JsonDecodingException_0(position, message + ' at path: ' + this.g13_1.x17() + hintMessage, this.d1d());
  };
  protoOf(AbstractJsonLexer).k17 = function (message, position, hint, $super) {
    position = position === VOID ? this.f13_1 : position;
    hint = hint === VOID ? '' : hint;
    return $super === VOID ? this.j17(message, position, hint) : $super.j17.call(this, message, position, hint);
  };
  protoOf(AbstractJsonLexer).g15 = function () {
    var current = this.g1d();
    current = this.e1d(current);
    if (current >= charSequenceLength(this.d1d()) || current === -1) {
      this.k17('EOF');
    }
    var tmp;
    if (charSequenceGet(this.d1d(), current) === _Char___init__impl__6a9atx(34)) {
      current = current + 1 | 0;
      if (current === charSequenceLength(this.d1d())) {
        this.k17('EOF');
      }
      tmp = true;
    } else {
      tmp = false;
    }
    var hasQuotation = tmp;
    var accumulator = new Long(0, 0);
    var exponentAccumulator = new Long(0, 0);
    var isNegative = false;
    var isExponentPositive = false;
    var hasExponent = false;
    var start = current;
    $l$loop_4: while (!(current === charSequenceLength(this.d1d()))) {
      var ch = charSequenceGet(this.d1d(), current);
      if ((ch === _Char___init__impl__6a9atx(101) || ch === _Char___init__impl__6a9atx(69)) && !hasExponent) {
        if (current === start) {
          this.k17('Unexpected symbol ' + toString_1(ch) + ' in numeric literal');
        }
        isExponentPositive = true;
        hasExponent = true;
        current = current + 1 | 0;
        continue $l$loop_4;
      }
      if (ch === _Char___init__impl__6a9atx(45) && hasExponent) {
        if (current === start) {
          this.k17("Unexpected symbol '-' in numeric literal");
        }
        isExponentPositive = false;
        current = current + 1 | 0;
        continue $l$loop_4;
      }
      if (ch === _Char___init__impl__6a9atx(43) && hasExponent) {
        if (current === start) {
          this.k17("Unexpected symbol '+' in numeric literal");
        }
        isExponentPositive = true;
        current = current + 1 | 0;
        continue $l$loop_4;
      }
      if (ch === _Char___init__impl__6a9atx(45)) {
        if (!(current === start)) {
          this.k17("Unexpected symbol '-' in numeric literal");
        }
        isNegative = true;
        current = current + 1 | 0;
        continue $l$loop_4;
      }
      var token = charToTokenClass(ch);
      if (!(token === 0))
        break $l$loop_4;
      current = current + 1 | 0;
      var digit = Char__minus_impl_a2frrh(ch, _Char___init__impl__6a9atx(48));
      if (!(0 <= digit ? digit <= 9 : false)) {
        this.k17("Unexpected symbol '" + toString_1(ch) + "' in numeric literal");
      }
      if (hasExponent) {
        // Inline function 'kotlin.Long.times' call
        // Inline function 'kotlin.Long.plus' call
        exponentAccumulator = exponentAccumulator.m2(toLong(10)).k2(toLong(digit));
        continue $l$loop_4;
      }
      // Inline function 'kotlin.Long.times' call
      // Inline function 'kotlin.Long.minus' call
      accumulator = accumulator.m2(toLong(10)).l2(toLong(digit));
      if (accumulator.y(new Long(0, 0)) > 0) {
        this.k17('Numeric value overflow');
      }
    }
    var hasChars = !(current === start);
    if (start === current || (isNegative && start === (current - 1 | 0))) {
      this.k17('Expected numeric literal');
    }
    if (hasQuotation) {
      if (!hasChars) {
        this.k17('EOF');
      }
      if (!(charSequenceGet(this.d1d(), current) === _Char___init__impl__6a9atx(34))) {
        this.k17('Expected closing quotation mark');
      }
      current = current + 1 | 0;
    }
    this.f13_1 = current;
    if (hasExponent) {
      var doubleAccumulator = accumulator.z2() * consumeNumericLiteral$calculateExponent(exponentAccumulator, isExponentPositive);
      if (doubleAccumulator > (new Long(-1, 2147483647)).z2() || doubleAccumulator < (new Long(0, -2147483648)).z2()) {
        this.k17('Numeric value overflow');
      }
      // Inline function 'kotlin.math.floor' call
      if (!(Math.floor(doubleAccumulator) === doubleAccumulator)) {
        this.k17("Can't convert " + doubleAccumulator + ' to Long');
      }
      accumulator = numberToLong(doubleAccumulator);
    }
    var tmp_0;
    if (isNegative) {
      tmp_0 = accumulator;
    } else if (!accumulator.equals(new Long(0, -2147483648))) {
      tmp_0 = accumulator.p2();
    } else {
      this.k17('Numeric value overflow');
    }
    return tmp_0;
  };
  protoOf(AbstractJsonLexer).q1a = function () {
    var current = this.g1d();
    if (current === charSequenceLength(this.d1d())) {
      this.k17('EOF');
    }
    var tmp;
    if (charSequenceGet(this.d1d(), current) === _Char___init__impl__6a9atx(34)) {
      current = current + 1 | 0;
      tmp = true;
    } else {
      tmp = false;
    }
    var hasQuotation = tmp;
    var result = consumeBoolean2(this, current);
    if (hasQuotation) {
      if (this.f13_1 === charSequenceLength(this.d1d())) {
        this.k17('EOF');
      }
      if (!(charSequenceGet(this.d1d(), this.f13_1) === _Char___init__impl__6a9atx(34))) {
        this.k17('Expected closing quotation mark');
      }
      this.f13_1 = this.f13_1 + 1 | 0;
    }
    return result;
  };
  function charToTokenClass(c) {
    var tmp;
    // Inline function 'kotlin.code' call
    if (Char__toInt_impl_vasixd(c) < 126) {
      var tmp_0 = CharMappings_getInstance().o1d_1;
      // Inline function 'kotlin.code' call
      tmp = tmp_0[Char__toInt_impl_vasixd(c)];
    } else {
      tmp = 0;
    }
    return tmp;
  }
  function tokenDescription(token) {
    return token === 1 ? "quotation mark '\"'" : token === 2 ? "string escape sequence '\\'" : token === 4 ? "comma ','" : token === 5 ? "colon ':'" : token === 6 ? "start of the object '{'" : token === 7 ? "end of the object '}'" : token === 8 ? "start of the array '['" : token === 9 ? "end of the array ']'" : token === 10 ? 'end of the input' : token === 127 ? 'invalid token' : 'valid token';
  }
  function escapeToChar(c) {
    return c < 117 ? CharMappings_getInstance().n1d_1[c] : _Char___init__impl__6a9atx(0);
  }
  function initEscape($this) {
    var inductionVariable = 0;
    if (inductionVariable <= 31)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        initC2ESC($this, i, _Char___init__impl__6a9atx(117));
      }
       while (inductionVariable <= 31);
    initC2ESC($this, 8, _Char___init__impl__6a9atx(98));
    initC2ESC($this, 9, _Char___init__impl__6a9atx(116));
    initC2ESC($this, 10, _Char___init__impl__6a9atx(110));
    initC2ESC($this, 12, _Char___init__impl__6a9atx(102));
    initC2ESC($this, 13, _Char___init__impl__6a9atx(114));
    initC2ESC_0($this, _Char___init__impl__6a9atx(47), _Char___init__impl__6a9atx(47));
    initC2ESC_0($this, _Char___init__impl__6a9atx(34), _Char___init__impl__6a9atx(34));
    initC2ESC_0($this, _Char___init__impl__6a9atx(92), _Char___init__impl__6a9atx(92));
  }
  function initCharToToken($this) {
    var inductionVariable = 0;
    if (inductionVariable <= 32)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        initC2TC($this, i, 127);
      }
       while (inductionVariable <= 32);
    initC2TC($this, 9, 3);
    initC2TC($this, 10, 3);
    initC2TC($this, 13, 3);
    initC2TC($this, 32, 3);
    initC2TC_0($this, _Char___init__impl__6a9atx(44), 4);
    initC2TC_0($this, _Char___init__impl__6a9atx(58), 5);
    initC2TC_0($this, _Char___init__impl__6a9atx(123), 6);
    initC2TC_0($this, _Char___init__impl__6a9atx(125), 7);
    initC2TC_0($this, _Char___init__impl__6a9atx(91), 8);
    initC2TC_0($this, _Char___init__impl__6a9atx(93), 9);
    initC2TC_0($this, _Char___init__impl__6a9atx(34), 1);
    initC2TC_0($this, _Char___init__impl__6a9atx(92), 2);
  }
  function initC2ESC($this, c, esc) {
    if (!(esc === _Char___init__impl__6a9atx(117))) {
      // Inline function 'kotlin.code' call
      var tmp$ret$0 = Char__toInt_impl_vasixd(esc);
      $this.n1d_1[tmp$ret$0] = numberToChar(c);
    }
  }
  function initC2ESC_0($this, c, esc) {
    // Inline function 'kotlin.code' call
    var tmp$ret$0 = Char__toInt_impl_vasixd(c);
    return initC2ESC($this, tmp$ret$0, esc);
  }
  function initC2TC($this, c, cl) {
    $this.o1d_1[c] = cl;
  }
  function initC2TC_0($this, c, cl) {
    // Inline function 'kotlin.code' call
    var tmp$ret$0 = Char__toInt_impl_vasixd(c);
    return initC2TC($this, tmp$ret$0, cl);
  }
  function CharMappings() {
    CharMappings_instance = this;
    this.n1d_1 = charArray(117);
    this.o1d_1 = new Int8Array(126);
    initEscape(this);
    initCharToToken(this);
  }
  var CharMappings_instance;
  function CharMappings_getInstance() {
    if (CharMappings_instance == null)
      new CharMappings();
    return CharMappings_instance;
  }
  function StringJsonLexerWithComments(source) {
    StringJsonLexer.call(this, source);
  }
  protoOf(StringJsonLexerWithComments).r18 = function () {
    var source = this.d1d();
    var cpos = this.g1d();
    if (cpos >= source.length || cpos === -1)
      return 10;
    this.f13_1 = cpos + 1 | 0;
    return charToTokenClass(charSequenceGet(source, cpos));
  };
  protoOf(StringJsonLexerWithComments).n18 = function () {
    var current = this.g1d();
    if (current >= this.d1d().length || current === -1)
      return false;
    return this.h1d(charSequenceGet(this.d1d(), current));
  };
  protoOf(StringJsonLexerWithComments).c1a = function (expected) {
    var source = this.d1d();
    var current = this.g1d();
    if (current >= source.length || current === -1) {
      this.f13_1 = -1;
      this.j1d(expected);
    }
    var c = charSequenceGet(source, current);
    this.f13_1 = current + 1 | 0;
    if (c === expected)
      return Unit_instance;
    else {
      this.j1d(expected);
    }
  };
  protoOf(StringJsonLexerWithComments).m18 = function () {
    var source = this.d1d();
    var cpos = this.g1d();
    if (cpos >= source.length || cpos === -1)
      return 10;
    this.f13_1 = cpos;
    return charToTokenClass(charSequenceGet(source, cpos));
  };
  protoOf(StringJsonLexerWithComments).g1d = function () {
    var current = this.f13_1;
    if (current === -1)
      return current;
    var source = this.d1d();
    $l$loop_1: while (current < source.length) {
      var c = charSequenceGet(source, current);
      // Inline function 'kotlinx.serialization.json.internal.AbstractJsonLexer.isWs' call
      if (c === _Char___init__impl__6a9atx(32) || c === _Char___init__impl__6a9atx(10) || c === _Char___init__impl__6a9atx(13) || c === _Char___init__impl__6a9atx(9)) {
        current = current + 1 | 0;
        continue $l$loop_1;
      }
      if (c === _Char___init__impl__6a9atx(47) && (current + 1 | 0) < source.length) {
        var tmp0_subject = charSequenceGet(source, current + 1 | 0);
        if (tmp0_subject === _Char___init__impl__6a9atx(47)) {
          current = indexOf_0(source, _Char___init__impl__6a9atx(10), current + 2 | 0);
          if (current === -1) {
            current = source.length;
          } else {
            current = current + 1 | 0;
          }
          continue $l$loop_1;
        } else if (tmp0_subject === _Char___init__impl__6a9atx(42)) {
          current = indexOf(source, '*/', current + 2 | 0);
          if (current === -1) {
            this.f13_1 = source.length;
            this.k17('Expected end of the block comment: "*/", but had EOF instead');
          } else {
            current = current + 2 | 0;
          }
          continue $l$loop_1;
        }
      }
      break $l$loop_1;
    }
    this.f13_1 = current;
    return current;
  };
  function StringJsonLexer(source) {
    AbstractJsonLexer.call(this);
    this.y1d_1 = source;
  }
  protoOf(StringJsonLexer).d1d = function () {
    return this.y1d_1;
  };
  protoOf(StringJsonLexer).e1d = function (position) {
    return position < this.d1d().length ? position : -1;
  };
  protoOf(StringJsonLexer).r18 = function () {
    var source = this.d1d();
    var cpos = this.f13_1;
    $l$loop: while (!(cpos === -1) && cpos < source.length) {
      var _unary__edvuaz = cpos;
      cpos = _unary__edvuaz + 1 | 0;
      var c = charSequenceGet(source, _unary__edvuaz);
      // Inline function 'kotlinx.serialization.json.internal.AbstractJsonLexer.isWs' call
      if (c === _Char___init__impl__6a9atx(32) || c === _Char___init__impl__6a9atx(10) || c === _Char___init__impl__6a9atx(13) || c === _Char___init__impl__6a9atx(9))
        continue $l$loop;
      this.f13_1 = cpos;
      return charToTokenClass(c);
    }
    this.f13_1 = source.length;
    return 10;
  };
  protoOf(StringJsonLexer).n18 = function () {
    var current = this.f13_1;
    if (current === -1)
      return false;
    var source = this.d1d();
    $l$loop: while (current < source.length) {
      var c = charSequenceGet(source, current);
      // Inline function 'kotlinx.serialization.json.internal.AbstractJsonLexer.isWs' call
      if (c === _Char___init__impl__6a9atx(32) || c === _Char___init__impl__6a9atx(10) || c === _Char___init__impl__6a9atx(13) || c === _Char___init__impl__6a9atx(9)) {
        current = current + 1 | 0;
        continue $l$loop;
      }
      this.f13_1 = current;
      return this.h1d(c);
    }
    this.f13_1 = current;
    return false;
  };
  protoOf(StringJsonLexer).g1d = function () {
    var current = this.f13_1;
    if (current === -1)
      return current;
    var source = this.d1d();
    $l$loop: while (current < source.length) {
      var c = charSequenceGet(source, current);
      // Inline function 'kotlinx.serialization.json.internal.AbstractJsonLexer.isWs' call
      if (c === _Char___init__impl__6a9atx(32) || c === _Char___init__impl__6a9atx(10) || c === _Char___init__impl__6a9atx(13) || c === _Char___init__impl__6a9atx(9)) {
        current = current + 1 | 0;
      } else {
        break $l$loop;
      }
    }
    this.f13_1 = current;
    return current;
  };
  protoOf(StringJsonLexer).c1a = function (expected) {
    if (this.f13_1 === -1) {
      this.j1d(expected);
    }
    var source = this.d1d();
    var cpos = this.f13_1;
    $l$loop: while (cpos < source.length) {
      var _unary__edvuaz = cpos;
      cpos = _unary__edvuaz + 1 | 0;
      var c = charSequenceGet(source, _unary__edvuaz);
      // Inline function 'kotlinx.serialization.json.internal.AbstractJsonLexer.isWs' call
      if (c === _Char___init__impl__6a9atx(32) || c === _Char___init__impl__6a9atx(10) || c === _Char___init__impl__6a9atx(13) || c === _Char___init__impl__6a9atx(9))
        continue $l$loop;
      this.f13_1 = cpos;
      if (c === expected)
        return Unit_instance;
      this.j1d(expected);
    }
    this.f13_1 = -1;
    this.j1d(expected);
  };
  protoOf(StringJsonLexer).i1a = function () {
    this.c1a(_Char___init__impl__6a9atx(34));
    var current = this.f13_1;
    var closingQuote = indexOf_0(this.d1d(), _Char___init__impl__6a9atx(34), current);
    if (closingQuote === -1) {
      this.p18();
      this.k1d(1, false);
    }
    var inductionVariable = current;
    if (inductionVariable < closingQuote)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        if (charSequenceGet(this.d1d(), i) === _Char___init__impl__6a9atx(92)) {
          return this.consumeString2(this.d1d(), this.f13_1, i);
        }
      }
       while (inductionVariable < closingQuote);
    this.f13_1 = closingQuote + 1 | 0;
    // Inline function 'kotlin.text.substring' call
    // Inline function 'kotlin.js.asDynamic' call
    return this.d1d().substring(current, closingQuote);
  };
  protoOf(StringJsonLexer).k1a = function (keyToMatch, isLenient) {
    var positionSnapshot = this.f13_1;
    try {
      if (!(this.r18() === 6))
        return null;
      var firstKey = this.f1a(isLenient);
      if (!(firstKey === keyToMatch))
        return null;
      this.l1d();
      if (!(this.r18() === 5))
        return null;
      return this.f1a(isLenient);
    }finally {
      this.f13_1 = positionSnapshot;
      this.l1d();
    }
  };
  function StringJsonLexer_0(json, source) {
    return !json.q12_1.s14_1 ? new StringJsonLexer(source) : new StringJsonLexerWithComments(source);
  }
  function get_schemaCache(_this__u8e3s4) {
    return _this__u8e3s4.s12_1;
  }
  function JsonToStringWriter() {
    this.v12_1 = StringBuilder_init_$Create$_0(128);
  }
  protoOf(JsonToStringWriter).o16 = function (value) {
    this.v12_1.oa(value);
  };
  protoOf(JsonToStringWriter).i16 = function (char) {
    this.v12_1.g7(char);
  };
  protoOf(JsonToStringWriter).k16 = function (text) {
    this.v12_1.f7(text);
  };
  protoOf(JsonToStringWriter).u16 = function (text) {
    printQuoted(this.v12_1, text);
  };
  protoOf(JsonToStringWriter).w12 = function () {
    this.v12_1.ra();
  };
  protoOf(JsonToStringWriter).toString = function () {
    return this.v12_1.toString();
  };
  function createMapForCache(initialCapacity) {
    return HashMap_init_$Create$(initialCapacity);
  }
  //region block: post-declaration
  protoOf(defer$1).qj = get_isNullable;
  protoOf(defer$1).wj = get_isInline;
  protoOf(defer$1).yj = get_annotations;
  protoOf(PolymorphismValidator).j12 = contextual;
  //endregion
  //region block: init
  Companion_instance = new Companion();
  Companion_instance_0 = new Companion_0();
  Companion_instance_1 = new Companion_1();
  Companion_instance_2 = new Companion_2();
  Tombstone_instance = new Tombstone();
  //endregion
  //region block: exports
  _.$_$ = _.$_$ || {};
  _.$_$.a = JsonArray;
  _.$_$.b = JsonObjectBuilder;
  _.$_$.c = JsonObject;
  _.$_$.d = JsonPrimitive_0;
  _.$_$.e = Json_0;
  _.$_$.f = put_0;
  _.$_$.g = put;
  //endregion
  return _;
}(module.exports, require('./kotlinx-serialization-kotlinx-serialization-core.js'), require('./kotlin-kotlin-stdlib.js')));

//# sourceMappingURL=kotlinx-serialization-kotlinx-serialization-json.js.map
