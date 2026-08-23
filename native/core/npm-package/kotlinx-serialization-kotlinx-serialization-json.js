(function (_, kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core, kotlin_kotlin) {
  'use strict';
  //region block: imports
  var imul = Math.imul;
  var EmptySerializersModule = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.a2;
  var protoOf = kotlin_kotlin.$_$.t7;
  var initMetadataForObject = kotlin_kotlin.$_$.b7;
  var VOID = kotlin_kotlin.$_$.f;
  var Unit_instance = kotlin_kotlin.$_$.r3;
  var initMetadataForClass = kotlin_kotlin.$_$.w6;
  var toString = kotlin_kotlin.$_$.x7;
  var IllegalArgumentException_init_$Create$ = kotlin_kotlin.$_$.c1;
  var charSequenceLength = kotlin_kotlin.$_$.o6;
  var charSequenceGet = kotlin_kotlin.$_$.n6;
  var _Char___init__impl__6a9atx = kotlin_kotlin.$_$.j1;
  var equals = kotlin_kotlin.$_$.r6;
  var toString_0 = kotlin_kotlin.$_$.sa;
  var Enum = kotlin_kotlin.$_$.r9;
  var Decoder = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.l1;
  var CompositeDecoder = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.j1;
  var initMetadataForInterface = kotlin_kotlin.$_$.z6;
  var initMetadataForCompanion = kotlin_kotlin.$_$.x6;
  var StringBuilder_init_$Create$ = kotlin_kotlin.$_$.z;
  var hashCode = kotlin_kotlin.$_$.v6;
  var joinToString = kotlin_kotlin.$_$.h5;
  var THROW_CCE = kotlin_kotlin.$_$.w9;
  var KtMap = kotlin_kotlin.$_$.a4;
  var SerializerFactory = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.w1;
  var getKClassFromExpression = kotlin_kotlin.$_$.d;
  var getBooleanHashCode = kotlin_kotlin.$_$.s6;
  var getStringHashCode = kotlin_kotlin.$_$.u6;
  var KtList = kotlin_kotlin.$_$.y3;
  var NumberFormatException_init_$Create$ = kotlin_kotlin.$_$.h1;
  var numberRangeToNumber = kotlin_kotlin.$_$.o7;
  var ClosedRange = kotlin_kotlin.$_$.y7;
  var isInterface = kotlin_kotlin.$_$.j7;
  var contains = kotlin_kotlin.$_$.b8;
  var toDouble = kotlin_kotlin.$_$.a9;
  var StringCompanionObject_instance = kotlin_kotlin.$_$.g3;
  var serializer = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.s;
  var InlinePrimitiveDescriptor = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.s1;
  var SEALED_getInstance = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.d;
  var buildSerialDescriptor = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.f1;
  var noWhenBranchMatchedException = kotlin_kotlin.$_$.qa;
  var KSerializer = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.e2;
  var MapSerializer = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.q;
  var SerialDescriptor = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.d1;
  var ListSerializer = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.p;
  var STRING_getInstance = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.e;
  var ENUM_getInstance = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.g;
  var PrimitiveSerialDescriptor = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.z;
  var toLongOrNull = kotlin_kotlin.$_$.d9;
  var toULongOrNull = kotlin_kotlin.$_$.g9;
  var ULong = kotlin_kotlin.$_$.da;
  var Companion_getInstance = kotlin_kotlin.$_$.p3;
  var serializer_0 = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.w;
  var _ULong___get_data__impl__fggpzb = kotlin_kotlin.$_$.j2;
  var toDoubleOrNull = kotlin_kotlin.$_$.z8;
  var toBooleanStrictOrNull = kotlin_kotlin.$_$.y8;
  var IllegalStateException_init_$Create$ = kotlin_kotlin.$_$.e1;
  var lazy = kotlin_kotlin.$_$.pa;
  var get_isNullable = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.c1;
  var get_isInline = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.b1;
  var get_annotations = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.a1;
  var KProperty1 = kotlin_kotlin.$_$.g8;
  var getPropertyCallableRef = kotlin_kotlin.$_$.t6;
  var Encoder = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.m1;
  var CompositeEncoder = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.k1;
  var toLong = kotlin_kotlin.$_$.v7;
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
  var coerceAtLeast = kotlin_kotlin.$_$.z7;
  var coerceAtMost = kotlin_kotlin.$_$.a8;
  var SerializationException_init_$Create$ = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.b;
  var CLASS_getInstance = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.h;
  var LinkedHashMap_init_$Create$ = kotlin_kotlin.$_$.s;
  var ArrayList_init_$Create$ = kotlin_kotlin.$_$.j;
  var singleOrNull = kotlin_kotlin.$_$.t5;
  var emptyMap = kotlin_kotlin.$_$.a5;
  var getValue = kotlin_kotlin.$_$.d5;
  var copyOf = kotlin_kotlin.$_$.v4;
  var copyOf_0 = kotlin_kotlin.$_$.w4;
  var LIST_getInstance = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.i;
  var DeepRecursiveFunction = kotlin_kotlin.$_$.p9;
  var invoke = kotlin_kotlin.$_$.la;
  var CoroutineImpl = kotlin_kotlin.$_$.f6;
  var DeepRecursiveScope = kotlin_kotlin.$_$.q9;
  var Unit = kotlin_kotlin.$_$.ga;
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
  var ensureNotNull = kotlin_kotlin.$_$.ka;
  var substringBefore = kotlin_kotlin.$_$.x8;
  var removeSuffix = kotlin_kotlin.$_$.s8;
  var substringAfter = kotlin_kotlin.$_$.w8;
  var contains_0 = kotlin_kotlin.$_$.k8;
  var plus = kotlin_kotlin.$_$.ra;
  var MissingFieldException = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.f2;
  var IllegalArgumentException = kotlin_kotlin.$_$.s9;
  var isFinite = kotlin_kotlin.$_$.na;
  var isFinite_0 = kotlin_kotlin.$_$.ma;
  var toUInt = kotlin_kotlin.$_$.f9;
  var _UInt___get_data__impl__f0vqqw = kotlin_kotlin.$_$.a2;
  var toULong = kotlin_kotlin.$_$.h9;
  var toUByte = kotlin_kotlin.$_$.e9;
  var _UByte___get_data__impl__jof9qr = kotlin_kotlin.$_$.r1;
  var toUShort = kotlin_kotlin.$_$.i9;
  var _UShort___get_data__impl__g0245 = kotlin_kotlin.$_$.s2;
  var objectCreate = kotlin_kotlin.$_$.s7;
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
  var numberToChar = kotlin_kotlin.$_$.p7;
  var equals_0 = kotlin_kotlin.$_$.m8;
  var toByte = kotlin_kotlin.$_$.u7;
  var startsWith = kotlin_kotlin.$_$.v8;
  var NamedValueDecoder = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.u1;
  var toShort = kotlin_kotlin.$_$.w7;
  var single = kotlin_kotlin.$_$.t8;
  var Char = kotlin_kotlin.$_$.n9;
  var emptySet = kotlin_kotlin.$_$.b5;
  var plus_0 = kotlin_kotlin.$_$.p5;
  var toInt = kotlin_kotlin.$_$.c9;
  var toList = kotlin_kotlin.$_$.y5;
  var enumEntries = kotlin_kotlin.$_$.g6;
  var getContextualDescriptor = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.g1;
  var last = kotlin_kotlin.$_$.l5;
  var removeLast = kotlin_kotlin.$_$.r5;
  var lastIndexOf = kotlin_kotlin.$_$.q8;
  var Long = kotlin_kotlin.$_$.t9;
  var Char__minus_impl_a2frrh = kotlin_kotlin.$_$.k1;
  var numberToLong = kotlin_kotlin.$_$.r7;
  var charArray = kotlin_kotlin.$_$.m6;
  var indexOf = kotlin_kotlin.$_$.n8;
  var indexOf_0 = kotlin_kotlin.$_$.o8;
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
  initMetadataForCompanion(Companion_0);
  initMetadataForClass(JsonObject, 'JsonObject', VOID, JsonElement, [JsonElement, KtMap], VOID, VOID, {0: JsonObjectSerializer_getInstance});
  initMetadataForClass(JsonPrimitive, 'JsonPrimitive', VOID, JsonElement, VOID, VOID, VOID, {0: JsonPrimitiveSerializer_getInstance});
  initMetadataForObject(JsonNull, 'JsonNull', VOID, JsonPrimitive, [JsonPrimitive, SerializerFactory], VOID, VOID, {0: JsonNullSerializer_getInstance});
  initMetadataForCompanion(Companion_1);
  initMetadataForClass(JsonLiteral, 'JsonLiteral', VOID, JsonPrimitive);
  initMetadataForCompanion(Companion_2);
  initMetadataForClass(JsonArray, 'JsonArray', VOID, JsonElement, [JsonElement, KtList], VOID, VOID, {0: JsonArraySerializer_getInstance});
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
    this.o12_1 = configuration;
    this.p12_1 = serializersModule;
    this.q12_1 = new DescriptorSchemaCache();
  }
  protoOf(Json).em = function () {
    return this.p12_1;
  };
  protoOf(Json).r12 = function (serializer, value) {
    var result = new JsonToStringWriter();
    try {
      encodeByWriter(this, result, serializer, value);
      return result.toString();
    }finally {
      result.u12();
    }
  };
  protoOf(Json).s12 = function (deserializer, string) {
    var lexer = StringJsonLexer_0(this, string);
    var input = new StreamingJsonDecoder(this, WriteMode_OBJ_getInstance(), lexer, deserializer.oi(), null);
    var result = input.ol(deserializer);
    lexer.h13();
    return result;
  };
  function Json_0(from, builderAction) {
    from = from === VOID ? Default_getInstance() : from;
    var builder = new JsonBuilder(from);
    builderAction(builder);
    var conf = builder.a14();
    return new JsonImpl(conf, builder.z13_1);
  }
  function JsonBuilder(json) {
    this.i13_1 = json.o12_1.b14_1;
    this.j13_1 = json.o12_1.g14_1;
    this.k13_1 = json.o12_1.c14_1;
    this.l13_1 = json.o12_1.d14_1;
    this.m13_1 = json.o12_1.f14_1;
    this.n13_1 = json.o12_1.h14_1;
    this.o13_1 = json.o12_1.i14_1;
    this.p13_1 = json.o12_1.k14_1;
    this.q13_1 = json.o12_1.r14_1;
    this.r13_1 = json.o12_1.m14_1;
    this.s13_1 = json.o12_1.n14_1;
    this.t13_1 = json.o12_1.o14_1;
    this.u13_1 = json.o12_1.p14_1;
    this.v13_1 = json.o12_1.q14_1;
    this.w13_1 = json.o12_1.l14_1;
    this.x13_1 = json.o12_1.e14_1;
    this.y13_1 = json.o12_1.j14_1;
    this.z13_1 = json.em();
  }
  protoOf(JsonBuilder).a14 = function () {
    if (this.y13_1) {
      // Inline function 'kotlin.require' call
      if (!(this.p13_1 === 'type')) {
        var message = 'Class discriminator should not be specified when array polymorphism is specified';
        throw IllegalArgumentException_init_$Create$(toString(message));
      }
      // Inline function 'kotlin.require' call
      if (!this.q13_1.equals(ClassDiscriminatorMode_POLYMORPHIC_getInstance())) {
        var message_0 = 'useArrayPolymorphism option can only be used if classDiscriminatorMode in a default POLYMORPHIC state.';
        throw IllegalArgumentException_init_$Create$(toString(message_0));
      }
    }
    if (!this.m13_1) {
      // Inline function 'kotlin.require' call
      if (!(this.n13_1 === '    ')) {
        var message_1 = 'Indent should not be specified when default printing mode is used';
        throw IllegalArgumentException_init_$Create$(toString(message_1));
      }
    } else if (!(this.n13_1 === '    ')) {
      var tmp3 = this.n13_1;
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
        var message_2 = 'Only whitespace, tab, newline and carriage return are allowed as pretty print symbols. Had ' + this.n13_1;
        throw IllegalArgumentException_init_$Create$(toString(message_2));
      }
    }
    return new JsonConfiguration(this.i13_1, this.k13_1, this.l13_1, this.x13_1, this.m13_1, this.j13_1, this.n13_1, this.o13_1, this.y13_1, this.p13_1, this.w13_1, this.r13_1, this.s13_1, this.t13_1, this.u13_1, this.v13_1, this.q13_1);
  };
  function validateConfiguration($this) {
    if (equals($this.em(), EmptySerializersModule()))
      return Unit_instance;
    var collector = new PolymorphismValidator($this.o12_1.j14_1, $this.o12_1.k14_1);
    $this.em().w11(collector);
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
    this.b14_1 = encodeDefaults;
    this.c14_1 = ignoreUnknownKeys;
    this.d14_1 = isLenient;
    this.e14_1 = allowStructuredMapKeys;
    this.f14_1 = prettyPrint;
    this.g14_1 = explicitNulls;
    this.h14_1 = prettyPrintIndent;
    this.i14_1 = coerceInputValues;
    this.j14_1 = useArrayPolymorphism;
    this.k14_1 = classDiscriminator;
    this.l14_1 = allowSpecialFloatingPointValues;
    this.m14_1 = useAlternativeNames;
    this.n14_1 = namingStrategy;
    this.o14_1 = decodeEnumsCaseInsensitive;
    this.p14_1 = allowTrailingComma;
    this.q14_1 = allowComments;
    this.r14_1 = classDiscriminatorMode;
  }
  protoOf(JsonConfiguration).toString = function () {
    return 'JsonConfiguration(encodeDefaults=' + this.b14_1 + ', ignoreUnknownKeys=' + this.c14_1 + ', isLenient=' + this.d14_1 + ', ' + ('allowStructuredMapKeys=' + this.e14_1 + ', prettyPrint=' + this.f14_1 + ', explicitNulls=' + this.g14_1 + ', ') + ("prettyPrintIndent='" + this.h14_1 + "', coerceInputValues=" + this.i14_1 + ', useArrayPolymorphism=' + this.j14_1 + ', ') + ("classDiscriminator='" + this.k14_1 + "', allowSpecialFloatingPointValues=" + this.l14_1 + ', ') + ('useAlternativeNames=' + this.m14_1 + ', namingStrategy=' + toString_0(this.n14_1) + ', decodeEnumsCaseInsensitive=' + this.o14_1 + ', ') + ('allowTrailingComma=' + this.p14_1 + ', allowComments=' + this.q14_1 + ', classDiscriminatorMode=' + this.r14_1.toString() + ')');
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
  function JsonElement() {
  }
  function Companion_0() {
  }
  var Companion_instance_0;
  function Companion_getInstance_4() {
    return Companion_instance_0;
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
    this.u14_1 = content;
  }
  protoOf(JsonObject).equals = function (other) {
    return equals(this.u14_1, other);
  };
  protoOf(JsonObject).hashCode = function () {
    return hashCode(this.u14_1);
  };
  protoOf(JsonObject).toString = function () {
    var tmp = this.u14_1.y1();
    return joinToString(tmp, ',', '{', '}', VOID, VOID, JsonObject$toString$lambda);
  };
  protoOf(JsonObject).v14 = function (key) {
    return this.u14_1.t1(key);
  };
  protoOf(JsonObject).t1 = function (key) {
    if (!(!(key == null) ? typeof key === 'string' : false))
      return false;
    return this.v14((!(key == null) ? typeof key === 'string' : false) ? key : THROW_CCE());
  };
  protoOf(JsonObject).ob = function (key) {
    return this.u14_1.v1(key);
  };
  protoOf(JsonObject).v1 = function (key) {
    if (!(!(key == null) ? typeof key === 'string' : false))
      return null;
    return this.ob((!(key == null) ? typeof key === 'string' : false) ? key : THROW_CCE());
  };
  protoOf(JsonObject).p = function () {
    return this.u14_1.p();
  };
  protoOf(JsonObject).y1 = function () {
    return this.u14_1.y1();
  };
  protoOf(JsonObject).w1 = function () {
    return this.u14_1.w1();
  };
  protoOf(JsonObject).j = function () {
    return this.u14_1.j();
  };
  protoOf(JsonObject).x1 = function () {
    return this.u14_1.x1();
  };
  function JsonNull() {
    JsonNull_instance = this;
    JsonPrimitive.call(this);
    this.w14_1 = 'null';
  }
  protoOf(JsonNull).x14 = function () {
    return this.w14_1;
  };
  protoOf(JsonNull).y14 = function () {
    return JsonNullSerializer_getInstance();
  };
  protoOf(JsonNull).du = function (typeParamsSerializers) {
    return this.y14();
  };
  var JsonNull_instance;
  function JsonNull_getInstance() {
    if (JsonNull_instance == null)
      new JsonNull();
    return JsonNull_instance;
  }
  function Companion_1() {
  }
  var Companion_instance_1;
  function Companion_getInstance_5() {
    return Companion_instance_1;
  }
  function JsonPrimitive() {
    JsonElement.call(this);
  }
  protoOf(JsonPrimitive).toString = function () {
    return this.x14();
  };
  function JsonPrimitive_0(value) {
    _init_properties_JsonElement_kt__7cbdc2();
    if (value == null)
      return JsonNull_getInstance();
    return new JsonLiteral(value, true);
  }
  function JsonLiteral(body, isString, coerceToInlineType) {
    coerceToInlineType = coerceToInlineType === VOID ? null : coerceToInlineType;
    JsonPrimitive.call(this);
    this.z14_1 = isString;
    this.a15_1 = coerceToInlineType;
    this.b15_1 = toString(body);
    if (!(this.a15_1 == null)) {
      // Inline function 'kotlin.require' call
      // Inline function 'kotlin.require' call
      if (!this.a15_1.uj()) {
        var message = 'Failed requirement.';
        throw IllegalArgumentException_init_$Create$(toString(message));
      }
    }
  }
  protoOf(JsonLiteral).x14 = function () {
    return this.b15_1;
  };
  protoOf(JsonLiteral).toString = function () {
    var tmp;
    if (this.z14_1) {
      // Inline function 'kotlin.text.buildString' call
      // Inline function 'kotlin.apply' call
      var this_0 = StringBuilder_init_$Create$();
      printQuoted(this_0, this.b15_1);
      tmp = this_0.toString();
    } else {
      tmp = this.b15_1;
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
    if (!(this.z14_1 === other.z14_1))
      return false;
    if (!(this.b15_1 === other.b15_1))
      return false;
    return true;
  };
  protoOf(JsonLiteral).hashCode = function () {
    var result = getBooleanHashCode(this.z14_1);
    result = imul(31, result) + getStringHashCode(this.b15_1) | 0;
    return result;
  };
  function Companion_2() {
  }
  var Companion_instance_2;
  function Companion_getInstance_6() {
    return Companion_instance_2;
  }
  function JsonArray(content) {
    JsonElement.call(this);
    this.c15_1 = content;
  }
  protoOf(JsonArray).equals = function (other) {
    return equals(this.c15_1, other);
  };
  protoOf(JsonArray).hashCode = function () {
    return hashCode(this.c15_1);
  };
  protoOf(JsonArray).toString = function () {
    return joinToString(this.c15_1, ',', '[', ']');
  };
  protoOf(JsonArray).d15 = function (element) {
    return this.c15_1.p1(element);
  };
  protoOf(JsonArray).p1 = function (element) {
    if (!(element instanceof JsonElement))
      return false;
    return this.d15(element instanceof JsonElement ? element : THROW_CCE());
  };
  protoOf(JsonArray).k = function (index) {
    return this.c15_1.k(index);
  };
  protoOf(JsonArray).p = function () {
    return this.c15_1.p();
  };
  protoOf(JsonArray).g = function () {
    return this.c15_1.g();
  };
  protoOf(JsonArray).j = function () {
    return this.c15_1.j();
  };
  function get_booleanOrNull(_this__u8e3s4) {
    _init_properties_JsonElement_kt__7cbdc2();
    return toBooleanStrictOrNull_0(_this__u8e3s4.x14());
  }
  function get_int(_this__u8e3s4) {
    _init_properties_JsonElement_kt__7cbdc2();
    // Inline function 'kotlinx.serialization.json.mapExceptions' call
    var tmp;
    try {
      tmp = (new StringJsonLexer(_this__u8e3s4.x14())).e15();
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
      throw NumberFormatException_init_$Create$(_this__u8e3s4.x14() + ' is not an Int');
    return result.a1();
  }
  function get_long(_this__u8e3s4) {
    _init_properties_JsonElement_kt__7cbdc2();
    // Inline function 'kotlinx.serialization.json.mapExceptions' call
    var tmp;
    try {
      tmp = (new StringJsonLexer(_this__u8e3s4.x14())).e15();
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
    var this_0 = _this__u8e3s4.x14();
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    return toDouble(this_0);
  }
  function get_double(_this__u8e3s4) {
    _init_properties_JsonElement_kt__7cbdc2();
    return toDouble(_this__u8e3s4.x14());
  }
  function get_contentOrNull(_this__u8e3s4) {
    _init_properties_JsonElement_kt__7cbdc2();
    var tmp;
    if (_this__u8e3s4 instanceof JsonNull) {
      tmp = null;
    } else {
      tmp = _this__u8e3s4.x14();
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
  function JsonElementSerializer$descriptor$lambda($this$buildSerialDescriptor) {
    $this$buildSerialDescriptor.zi('JsonPrimitive', defer(JsonElementSerializer$descriptor$lambda$lambda));
    $this$buildSerialDescriptor.zi('JsonNull', defer(JsonElementSerializer$descriptor$lambda$lambda_0));
    $this$buildSerialDescriptor.zi('JsonLiteral', defer(JsonElementSerializer$descriptor$lambda$lambda_1));
    $this$buildSerialDescriptor.zi('JsonObject', defer(JsonElementSerializer$descriptor$lambda$lambda_2));
    $this$buildSerialDescriptor.zi('JsonArray', defer(JsonElementSerializer$descriptor$lambda$lambda_3));
    return Unit_instance;
  }
  function JsonElementSerializer$descriptor$lambda$lambda() {
    return JsonPrimitiveSerializer_getInstance().f15_1;
  }
  function JsonElementSerializer$descriptor$lambda$lambda_0() {
    return JsonNullSerializer_getInstance().g15_1;
  }
  function JsonElementSerializer$descriptor$lambda$lambda_1() {
    return JsonLiteralSerializer_getInstance().h15_1;
  }
  function JsonElementSerializer$descriptor$lambda$lambda_2() {
    return JsonObjectSerializer_getInstance().i15_1;
  }
  function JsonElementSerializer$descriptor$lambda$lambda_3() {
    return JsonArraySerializer_getInstance().j15_1;
  }
  function JsonElementSerializer() {
    JsonElementSerializer_instance = this;
    var tmp = this;
    var tmp_0 = SEALED_getInstance();
    tmp.k15_1 = buildSerialDescriptor('kotlinx.serialization.json.JsonElement', tmp_0, [], JsonElementSerializer$descriptor$lambda);
  }
  protoOf(JsonElementSerializer).oi = function () {
    return this.k15_1;
  };
  protoOf(JsonElementSerializer).l15 = function (encoder, value) {
    verify(encoder);
    if (value instanceof JsonPrimitive) {
      encoder.hn(JsonPrimitiveSerializer_getInstance(), value);
    } else {
      if (value instanceof JsonObject) {
        encoder.hn(JsonObjectSerializer_getInstance(), value);
      } else {
        if (value instanceof JsonArray) {
          encoder.hn(JsonArraySerializer_getInstance(), value);
        } else {
          noWhenBranchMatchedException();
        }
      }
    }
  };
  protoOf(JsonElementSerializer).pi = function (encoder, value) {
    return this.l15(encoder, value instanceof JsonElement ? value : THROW_CCE());
  };
  protoOf(JsonElementSerializer).qi = function (decoder) {
    var input = asJsonDecoder(decoder);
    return input.t14();
  };
  var JsonElementSerializer_instance;
  function JsonElementSerializer_getInstance() {
    if (JsonElementSerializer_instance == null)
      new JsonElementSerializer();
    return JsonElementSerializer_instance;
  }
  function JsonObjectDescriptor() {
    JsonObjectDescriptor_instance = this;
    this.m15_1 = MapSerializer(serializer(StringCompanionObject_instance), JsonElementSerializer_getInstance()).oi();
    this.n15_1 = 'kotlinx.serialization.json.JsonObject';
  }
  protoOf(JsonObjectDescriptor).sj = function () {
    return this.n15_1;
  };
  protoOf(JsonObjectDescriptor).xj = function (index) {
    return this.m15_1.xj(index);
  };
  protoOf(JsonObjectDescriptor).yj = function (name) {
    return this.m15_1.yj(name);
  };
  protoOf(JsonObjectDescriptor).zj = function (index) {
    return this.m15_1.zj(index);
  };
  protoOf(JsonObjectDescriptor).ak = function (index) {
    return this.m15_1.ak(index);
  };
  protoOf(JsonObjectDescriptor).bk = function (index) {
    return this.m15_1.bk(index);
  };
  protoOf(JsonObjectDescriptor).tj = function () {
    return this.m15_1.tj();
  };
  protoOf(JsonObjectDescriptor).oj = function () {
    return this.m15_1.oj();
  };
  protoOf(JsonObjectDescriptor).uj = function () {
    return this.m15_1.uj();
  };
  protoOf(JsonObjectDescriptor).vj = function () {
    return this.m15_1.vj();
  };
  protoOf(JsonObjectDescriptor).wj = function () {
    return this.m15_1.wj();
  };
  var JsonObjectDescriptor_instance;
  function JsonObjectDescriptor_getInstance() {
    if (JsonObjectDescriptor_instance == null)
      new JsonObjectDescriptor();
    return JsonObjectDescriptor_instance;
  }
  function JsonObjectSerializer() {
    JsonObjectSerializer_instance = this;
    this.i15_1 = JsonObjectDescriptor_getInstance();
  }
  protoOf(JsonObjectSerializer).oi = function () {
    return this.i15_1;
  };
  protoOf(JsonObjectSerializer).o15 = function (encoder, value) {
    verify(encoder);
    MapSerializer(serializer(StringCompanionObject_instance), JsonElementSerializer_getInstance()).pi(encoder, value);
  };
  protoOf(JsonObjectSerializer).pi = function (encoder, value) {
    return this.o15(encoder, value instanceof JsonObject ? value : THROW_CCE());
  };
  protoOf(JsonObjectSerializer).qi = function (decoder) {
    verify_0(decoder);
    return new JsonObject(MapSerializer(serializer(StringCompanionObject_instance), JsonElementSerializer_getInstance()).qi(decoder));
  };
  var JsonObjectSerializer_instance;
  function JsonObjectSerializer_getInstance() {
    if (JsonObjectSerializer_instance == null)
      new JsonObjectSerializer();
    return JsonObjectSerializer_instance;
  }
  function JsonArrayDescriptor() {
    JsonArrayDescriptor_instance = this;
    this.p15_1 = ListSerializer(JsonElementSerializer_getInstance()).oi();
    this.q15_1 = 'kotlinx.serialization.json.JsonArray';
  }
  protoOf(JsonArrayDescriptor).sj = function () {
    return this.q15_1;
  };
  protoOf(JsonArrayDescriptor).xj = function (index) {
    return this.p15_1.xj(index);
  };
  protoOf(JsonArrayDescriptor).yj = function (name) {
    return this.p15_1.yj(name);
  };
  protoOf(JsonArrayDescriptor).zj = function (index) {
    return this.p15_1.zj(index);
  };
  protoOf(JsonArrayDescriptor).ak = function (index) {
    return this.p15_1.ak(index);
  };
  protoOf(JsonArrayDescriptor).bk = function (index) {
    return this.p15_1.bk(index);
  };
  protoOf(JsonArrayDescriptor).tj = function () {
    return this.p15_1.tj();
  };
  protoOf(JsonArrayDescriptor).oj = function () {
    return this.p15_1.oj();
  };
  protoOf(JsonArrayDescriptor).uj = function () {
    return this.p15_1.uj();
  };
  protoOf(JsonArrayDescriptor).vj = function () {
    return this.p15_1.vj();
  };
  protoOf(JsonArrayDescriptor).wj = function () {
    return this.p15_1.wj();
  };
  var JsonArrayDescriptor_instance;
  function JsonArrayDescriptor_getInstance() {
    if (JsonArrayDescriptor_instance == null)
      new JsonArrayDescriptor();
    return JsonArrayDescriptor_instance;
  }
  function JsonArraySerializer() {
    JsonArraySerializer_instance = this;
    this.j15_1 = JsonArrayDescriptor_getInstance();
  }
  protoOf(JsonArraySerializer).oi = function () {
    return this.j15_1;
  };
  protoOf(JsonArraySerializer).r15 = function (encoder, value) {
    verify(encoder);
    ListSerializer(JsonElementSerializer_getInstance()).pi(encoder, value);
  };
  protoOf(JsonArraySerializer).pi = function (encoder, value) {
    return this.r15(encoder, value instanceof JsonArray ? value : THROW_CCE());
  };
  protoOf(JsonArraySerializer).qi = function (decoder) {
    verify_0(decoder);
    return new JsonArray(ListSerializer(JsonElementSerializer_getInstance()).qi(decoder));
  };
  var JsonArraySerializer_instance;
  function JsonArraySerializer_getInstance() {
    if (JsonArraySerializer_instance == null)
      new JsonArraySerializer();
    return JsonArraySerializer_instance;
  }
  function defer(deferred) {
    return new defer$1(deferred);
  }
  function JsonPrimitiveSerializer() {
    JsonPrimitiveSerializer_instance = this;
    this.f15_1 = buildSerialDescriptor('kotlinx.serialization.json.JsonPrimitive', STRING_getInstance(), []);
  }
  protoOf(JsonPrimitiveSerializer).oi = function () {
    return this.f15_1;
  };
  protoOf(JsonPrimitiveSerializer).s15 = function (encoder, value) {
    verify(encoder);
    var tmp;
    if (value instanceof JsonNull) {
      encoder.hn(JsonNullSerializer_getInstance(), JsonNull_getInstance());
      tmp = Unit_instance;
    } else {
      var tmp_0 = JsonLiteralSerializer_getInstance();
      encoder.hn(tmp_0, value instanceof JsonLiteral ? value : THROW_CCE());
      tmp = Unit_instance;
    }
    return tmp;
  };
  protoOf(JsonPrimitiveSerializer).pi = function (encoder, value) {
    return this.s15(encoder, value instanceof JsonPrimitive ? value : THROW_CCE());
  };
  protoOf(JsonPrimitiveSerializer).qi = function (decoder) {
    var result = asJsonDecoder(decoder).t14();
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
    this.g15_1 = buildSerialDescriptor('kotlinx.serialization.json.JsonNull', ENUM_getInstance(), []);
  }
  protoOf(JsonNullSerializer).oi = function () {
    return this.g15_1;
  };
  protoOf(JsonNullSerializer).t15 = function (encoder, value) {
    verify(encoder);
    encoder.km();
  };
  protoOf(JsonNullSerializer).pi = function (encoder, value) {
    return this.t15(encoder, value instanceof JsonNull ? value : THROW_CCE());
  };
  protoOf(JsonNullSerializer).qi = function (decoder) {
    verify_0(decoder);
    if (decoder.al()) {
      throw new JsonDecodingException("Expected 'null' literal");
    }
    decoder.bl();
    return JsonNull_getInstance();
  };
  var JsonNullSerializer_instance;
  function JsonNullSerializer_getInstance() {
    if (JsonNullSerializer_instance == null)
      new JsonNullSerializer();
    return JsonNullSerializer_instance;
  }
  function JsonLiteralSerializer() {
    JsonLiteralSerializer_instance = this;
    this.h15_1 = PrimitiveSerialDescriptor('kotlinx.serialization.json.JsonLiteral', STRING_getInstance());
  }
  protoOf(JsonLiteralSerializer).oi = function () {
    return this.h15_1;
  };
  protoOf(JsonLiteralSerializer).u15 = function (encoder, value) {
    verify(encoder);
    if (value.z14_1) {
      return encoder.tm(value.b15_1);
    }
    if (!(value.a15_1 == null)) {
      return encoder.vm(value.a15_1).tm(value.b15_1);
    }
    var tmp0_safe_receiver = toLongOrNull(value.b15_1);
    if (tmp0_safe_receiver == null)
      null;
    else {
      // Inline function 'kotlin.let' call
      return encoder.pm(tmp0_safe_receiver);
    }
    var tmp1_safe_receiver = toULongOrNull(value.b15_1);
    var tmp = tmp1_safe_receiver;
    if ((tmp == null ? null : new ULong(tmp)) == null)
      null;
    else {
      var tmp_0 = tmp1_safe_receiver;
      // Inline function 'kotlin.let' call
      var it = (tmp_0 == null ? null : new ULong(tmp_0)).yh_1;
      var tmp_1 = encoder.vm(serializer_0(Companion_getInstance()).oi());
      // Inline function 'kotlin.ULong.toLong' call
      var tmp$ret$1 = _ULong___get_data__impl__fggpzb(it);
      tmp_1.pm(tmp$ret$1);
      return Unit_instance;
    }
    var tmp2_safe_receiver = toDoubleOrNull(value.b15_1);
    if (tmp2_safe_receiver == null)
      null;
    else {
      // Inline function 'kotlin.let' call
      return encoder.rm(tmp2_safe_receiver);
    }
    var tmp3_safe_receiver = toBooleanStrictOrNull(value.b15_1);
    if (tmp3_safe_receiver == null)
      null;
    else {
      // Inline function 'kotlin.let' call
      return encoder.lm(tmp3_safe_receiver);
    }
    encoder.tm(value.b15_1);
  };
  protoOf(JsonLiteralSerializer).pi = function (encoder, value) {
    return this.u15(encoder, value instanceof JsonLiteral ? value : THROW_CCE());
  };
  protoOf(JsonLiteralSerializer).qi = function (decoder) {
    var result = asJsonDecoder(decoder).t14();
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
    var tmp0 = $this.v15_1;
    // Inline function 'kotlin.getValue' call
    original$factory();
    return tmp0.s1();
  }
  function defer$1($deferred) {
    this.v15_1 = lazy($deferred);
  }
  protoOf(defer$1).sj = function () {
    return _get_original__l7ku1m(this).sj();
  };
  protoOf(defer$1).tj = function () {
    return _get_original__l7ku1m(this).tj();
  };
  protoOf(defer$1).vj = function () {
    return _get_original__l7ku1m(this).vj();
  };
  protoOf(defer$1).xj = function (index) {
    return _get_original__l7ku1m(this).xj(index);
  };
  protoOf(defer$1).yj = function (name) {
    return _get_original__l7ku1m(this).yj(name);
  };
  protoOf(defer$1).zj = function (index) {
    return _get_original__l7ku1m(this).zj(index);
  };
  protoOf(defer$1).ak = function (index) {
    return _get_original__l7ku1m(this).ak(index);
  };
  protoOf(defer$1).bk = function (index) {
    return _get_original__l7ku1m(this).bk(index);
  };
  function original$factory() {
    return getPropertyCallableRef('original', 1, KProperty1, function (receiver) {
      return _get_original__l7ku1m(receiver);
    }, null);
  }
  function JsonEncoder() {
  }
  function Composer(writer) {
    this.w15_1 = writer;
    this.x15_1 = true;
  }
  protoOf(Composer).y15 = function () {
    this.x15_1 = true;
  };
  protoOf(Composer).z15 = function () {
    return Unit_instance;
  };
  protoOf(Composer).a16 = function () {
    this.x15_1 = false;
  };
  protoOf(Composer).b16 = function () {
    this.x15_1 = false;
  };
  protoOf(Composer).c16 = function () {
    return Unit_instance;
  };
  protoOf(Composer).d16 = function (v) {
    return this.w15_1.e16(v);
  };
  protoOf(Composer).f16 = function (v) {
    return this.w15_1.g16(v);
  };
  protoOf(Composer).h16 = function (v) {
    return this.w15_1.g16(v.toString());
  };
  protoOf(Composer).i16 = function (v) {
    return this.w15_1.g16(v.toString());
  };
  protoOf(Composer).j16 = function (v) {
    return this.w15_1.k16(toLong(v));
  };
  protoOf(Composer).l16 = function (v) {
    return this.w15_1.k16(toLong(v));
  };
  protoOf(Composer).m16 = function (v) {
    return this.w15_1.k16(toLong(v));
  };
  protoOf(Composer).n16 = function (v) {
    return this.w15_1.k16(v);
  };
  protoOf(Composer).o16 = function (v) {
    return this.w15_1.g16(v.toString());
  };
  protoOf(Composer).p16 = function (value) {
    return this.w15_1.q16(value);
  };
  function Composer_0(sb, json) {
    return json.o12_1.f14_1 ? new ComposerWithPrettyPrint(sb, json) : new Composer(sb);
  }
  function ComposerForUnsignedNumbers(writer, forceQuoting) {
    Composer.call(this, writer);
    this.t16_1 = forceQuoting;
  }
  protoOf(ComposerForUnsignedNumbers).m16 = function (v) {
    if (this.t16_1) {
      // Inline function 'kotlin.toUInt' call
      var tmp$ret$0 = _UInt___init__impl__l7qpdl(v);
      this.p16(UInt__toString_impl_dbgl21(tmp$ret$0));
    } else {
      // Inline function 'kotlin.toUInt' call
      var tmp$ret$1 = _UInt___init__impl__l7qpdl(v);
      this.f16(UInt__toString_impl_dbgl21(tmp$ret$1));
    }
  };
  protoOf(ComposerForUnsignedNumbers).n16 = function (v) {
    if (this.t16_1) {
      // Inline function 'kotlin.toULong' call
      var tmp$ret$0 = _ULong___init__impl__c78o9k(v);
      this.p16(ULong__toString_impl_f9au7k(tmp$ret$0));
    } else {
      // Inline function 'kotlin.toULong' call
      var tmp$ret$1 = _ULong___init__impl__c78o9k(v);
      this.f16(ULong__toString_impl_f9au7k(tmp$ret$1));
    }
  };
  protoOf(ComposerForUnsignedNumbers).j16 = function (v) {
    if (this.t16_1) {
      // Inline function 'kotlin.toUByte' call
      var tmp$ret$0 = _UByte___init__impl__g9hnc4(v);
      this.p16(UByte__toString_impl_v72jg(tmp$ret$0));
    } else {
      // Inline function 'kotlin.toUByte' call
      var tmp$ret$1 = _UByte___init__impl__g9hnc4(v);
      this.f16(UByte__toString_impl_v72jg(tmp$ret$1));
    }
  };
  protoOf(ComposerForUnsignedNumbers).l16 = function (v) {
    if (this.t16_1) {
      // Inline function 'kotlin.toUShort' call
      var tmp$ret$0 = _UShort___init__impl__jigrne(v);
      this.p16(UShort__toString_impl_edaoee(tmp$ret$0));
    } else {
      // Inline function 'kotlin.toUShort' call
      var tmp$ret$1 = _UShort___init__impl__jigrne(v);
      this.f16(UShort__toString_impl_edaoee(tmp$ret$1));
    }
  };
  function ComposerForUnquotedLiterals(writer, forceQuoting) {
    Composer.call(this, writer);
    this.w16_1 = forceQuoting;
  }
  protoOf(ComposerForUnquotedLiterals).p16 = function (value) {
    if (this.w16_1) {
      protoOf(Composer).p16.call(this, value);
    } else {
      protoOf(Composer).f16.call(this, value);
    }
  };
  function ComposerWithPrettyPrint(writer, json) {
    Composer.call(this, writer);
    this.z16_1 = json;
    this.a17_1 = 0;
  }
  protoOf(ComposerWithPrettyPrint).y15 = function () {
    this.x15_1 = true;
    this.a17_1 = this.a17_1 + 1 | 0;
  };
  protoOf(ComposerWithPrettyPrint).z15 = function () {
    this.a17_1 = this.a17_1 - 1 | 0;
  };
  protoOf(ComposerWithPrettyPrint).a16 = function () {
    this.x15_1 = false;
    this.f16('\n');
    // Inline function 'kotlin.repeat' call
    var times = this.a17_1;
    var inductionVariable = 0;
    if (inductionVariable < times)
      do {
        var index = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        this.f16(this.z16_1.o12_1.h14_1);
      }
       while (inductionVariable < times);
  };
  protoOf(ComposerWithPrettyPrint).b16 = function () {
    if (this.x15_1)
      this.x15_1 = false;
    else {
      this.a16();
    }
  };
  protoOf(ComposerWithPrettyPrint).c16 = function () {
    this.d16(_Char___init__impl__6a9atx(32));
  };
  function readIfAbsent($this, descriptor, index) {
    $this.c17_1 = (!descriptor.bk(index) && descriptor.ak(index).oj());
    return $this.c17_1;
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
    tmp.b17_1 = new ElementMarker(descriptor, JsonElementMarker$readIfAbsent$ref(this));
    this.c17_1 = false;
  }
  protoOf(JsonElementMarker).d17 = function (index) {
    this.b17_1.vr(index);
  };
  protoOf(JsonElementMarker).e17 = function () {
    return this.b17_1.wr();
  };
  function invalidTrailingComma(_this__u8e3s4, entity) {
    entity = entity === VOID ? 'object' : entity;
    _this__u8e3s4.f17('Trailing comma before the end of JSON ' + entity, _this__u8e3s4.d13_1 - 1 | 0, "Trailing commas are non-complaint JSON and not allowed by default. Use 'allowTrailingCommas = true' in 'Json {}' builder to support them.");
  }
  function throwInvalidFloatingPointDecoded(_this__u8e3s4, result) {
    _this__u8e3s4.g17('Unexpected special floating-point value ' + toString(result) + '. By default, ' + 'non-finite floating point values are prohibited because they do not conform JSON specification', VOID, "It is possible to deserialize them using 'JsonBuilder.allowSpecialFloatingPointValues = true'");
  }
  function JsonEncodingException(message) {
    JsonException.call(this, message);
    captureStack(this, JsonEncodingException);
  }
  function InvalidKeyKindException(keyDescriptor) {
    return new JsonEncodingException("Value of type '" + keyDescriptor.sj() + "' can't be used in JSON as a key in the map. " + ("It should have either primitive or enum kind, but its kind is '" + keyDescriptor.tj().toString() + "'.\n") + "Use 'allowStructuredMapKeys = true' in 'Json {}' builder to convert such maps to [key1, value1, key2, value2,...] arrays.");
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
    var index = _this__u8e3s4.yj(name);
    if (!(index === -3))
      return index;
    if (!json.o12_1.m14_1)
      return index;
    return getJsonNameIndexSlowPath(_this__u8e3s4, json, name);
  }
  function getJsonNameIndexOrThrow(_this__u8e3s4, json, name, suffix) {
    suffix = suffix === VOID ? '' : suffix;
    _init_properties_JsonNamesMap_kt__cbbp0k();
    var index = getJsonNameIndex(_this__u8e3s4, json, name);
    if (index === -3)
      throw SerializationException_init_$Create$(_this__u8e3s4.sj() + " does not contain element with name '" + name + "'" + suffix);
    return index;
  }
  function getJsonElementName(_this__u8e3s4, json, index) {
    _init_properties_JsonNamesMap_kt__cbbp0k();
    var strategy = namingStrategy(_this__u8e3s4, json);
    return strategy == null ? _this__u8e3s4.xj(index) : serializationNamesIndices(_this__u8e3s4, json, strategy)[index];
  }
  function namingStrategy(_this__u8e3s4, json) {
    _init_properties_JsonNamesMap_kt__cbbp0k();
    return equals(_this__u8e3s4.tj(), CLASS_getInstance()) ? json.o12_1.n14_1 : null;
  }
  function deserializationNamesMap(_this__u8e3s4, descriptor) {
    _init_properties_JsonNamesMap_kt__cbbp0k();
    var tmp = get_schemaCache(_this__u8e3s4);
    var tmp_0 = get_JsonDeserializationNamesKey();
    return tmp.i17(descriptor, tmp_0, deserializationNamesMap$lambda(descriptor, _this__u8e3s4));
  }
  function decodeCaseInsensitive(_this__u8e3s4, descriptor) {
    _init_properties_JsonNamesMap_kt__cbbp0k();
    return _this__u8e3s4.o12_1.o14_1 && equals(descriptor.tj(), ENUM_getInstance());
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
    return tmp.i17(_this__u8e3s4, tmp_0, serializationNamesIndices$lambda(_this__u8e3s4, strategy));
  }
  function buildDeserializationNamesMap(_this__u8e3s4, json) {
    _init_properties_JsonNamesMap_kt__cbbp0k();
    // Inline function 'kotlin.collections.mutableMapOf' call
    var builder = LinkedHashMap_init_$Create$();
    var useLowercaseEnums = decodeCaseInsensitive(json, _this__u8e3s4);
    var strategyForClasses = namingStrategy(_this__u8e3s4, json);
    var inductionVariable = 0;
    var last = _this__u8e3s4.vj();
    if (inductionVariable < last)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        // Inline function 'kotlin.collections.filterIsInstance' call
        var tmp0 = _this__u8e3s4.zj(i);
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
        var tmp1_safe_receiver = tmp0_safe_receiver == null ? null : tmp0_safe_receiver.j17_1;
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
          tmp_0 = _this__u8e3s4.xj(i).toLowerCase();
        } else if (!(strategyForClasses == null)) {
          tmp_0 = strategyForClasses.k17(_this__u8e3s4, i, _this__u8e3s4.xj(i));
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
    var entity = equals($this_buildDeserializationNamesMap.tj(), ENUM_getInstance()) ? 'enum value' : 'property';
    // Inline function 'kotlin.collections.contains' call
    // Inline function 'kotlin.collections.containsKey' call
    if ((isInterface(_this__u8e3s4, KtMap) ? _this__u8e3s4 : THROW_CCE()).t1(name)) {
      throw new JsonException("The suggested name '" + name + "' for " + entity + ' ' + $this_buildDeserializationNamesMap.xj(index) + ' is already one of the names for ' + entity + ' ' + ($this_buildDeserializationNamesMap.xj(getValue(_this__u8e3s4, name)) + ' in ' + toString($this_buildDeserializationNamesMap)));
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
      var tmp_0 = $this_serializationNamesIndices.vj();
      // Inline function 'kotlin.arrayOfNulls' call
      var tmp_1 = Array(tmp_0);
      while (tmp < tmp_0) {
        var tmp_2 = tmp;
        var baseName = $this_serializationNamesIndices.xj(tmp_2);
        tmp_1[tmp_2] = $strategy.k17($this_serializationNamesIndices, tmp_2, baseName);
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
    var newSize = imul($this.n17_1, 2);
    $this.l17_1 = copyOf($this.l17_1, newSize);
    $this.m17_1 = copyOf_0($this.m17_1, newSize);
  }
  function JsonPath() {
    var tmp = this;
    // Inline function 'kotlin.arrayOfNulls' call
    tmp.l17_1 = Array(8);
    var tmp_0 = this;
    var tmp_1 = 0;
    var tmp_2 = new Int32Array(8);
    while (tmp_1 < 8) {
      tmp_2[tmp_1] = -1;
      tmp_1 = tmp_1 + 1 | 0;
    }
    tmp_0.m17_1 = tmp_2;
    this.n17_1 = -1;
  }
  protoOf(JsonPath).o17 = function (sd) {
    this.n17_1 = this.n17_1 + 1 | 0;
    var depth = this.n17_1;
    if (depth === this.l17_1.length) {
      resize(this);
    }
    this.l17_1[depth] = sd;
  };
  protoOf(JsonPath).p17 = function (index) {
    this.m17_1[this.n17_1] = index;
  };
  protoOf(JsonPath).q17 = function (key) {
    var tmp;
    if (!(this.m17_1[this.n17_1] === -2)) {
      this.n17_1 = this.n17_1 + 1 | 0;
      tmp = this.n17_1 === this.l17_1.length;
    } else {
      tmp = false;
    }
    if (tmp) {
      resize(this);
    }
    this.l17_1[this.n17_1] = key;
    this.m17_1[this.n17_1] = -2;
  };
  protoOf(JsonPath).r17 = function () {
    if (this.m17_1[this.n17_1] === -2) {
      this.l17_1[this.n17_1] = Tombstone_instance;
    }
  };
  protoOf(JsonPath).s17 = function () {
    var depth = this.n17_1;
    if (this.m17_1[depth] === -2) {
      this.m17_1[depth] = -1;
      this.n17_1 = this.n17_1 - 1 | 0;
    }
    if (!(this.n17_1 === -1)) {
      this.n17_1 = this.n17_1 - 1 | 0;
    }
  };
  protoOf(JsonPath).t17 = function () {
    // Inline function 'kotlin.text.buildString' call
    // Inline function 'kotlin.apply' call
    var this_0 = StringBuilder_init_$Create$();
    this_0.f7('$');
    // Inline function 'kotlin.repeat' call
    var times = this.n17_1 + 1 | 0;
    var inductionVariable = 0;
    if (inductionVariable < times)
      do {
        var index = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        var element = this.l17_1[index];
        if (!(element == null) ? isInterface(element, SerialDescriptor) : false) {
          if (equals(element.tj(), LIST_getInstance())) {
            if (!(this.m17_1[index] === -1)) {
              this_0.f7('[');
              this_0.na(this.m17_1[index]);
              this_0.f7(']');
            }
          } else {
            var idx = this.m17_1[index];
            if (idx >= 0) {
              this_0.f7('.');
              this_0.f7(element.xj(idx));
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
    return this.t17();
  };
  function encodeByWriter(json, writer, serializer, value) {
    var tmp = WriteMode_OBJ_getInstance();
    // Inline function 'kotlin.arrayOfNulls' call
    var size = get_entries().j();
    var tmp$ret$0 = Array(size);
    var encoder = StreamingJsonEncoder_init_$Create$(writer, json, tmp, tmp$ret$0);
    encoder.hn(serializer, value);
  }
  function readObject($this) {
    // Inline function 'kotlinx.serialization.json.internal.JsonTreeReader.readObjectImpl' call
    var lastToken = $this.d18_1.h18(6);
    if ($this.d18_1.i18() === 4) {
      $this.d18_1.g17('Unexpected leading comma');
    }
    // Inline function 'kotlin.collections.linkedMapOf' call
    var result = LinkedHashMap_init_$Create$();
    $l$loop: while ($this.d18_1.j18()) {
      var key = $this.e18_1 ? $this.d18_1.l18() : $this.d18_1.k18();
      $this.d18_1.h18(5);
      var element = $this.m18();
      // Inline function 'kotlin.collections.set' call
      result.c2(key, element);
      lastToken = $this.d18_1.n18();
      var tmp0_subject = lastToken;
      if (tmp0_subject !== 4)
        if (tmp0_subject === 7)
          break $l$loop;
        else {
          $this.d18_1.g17('Expected end of the object or comma');
        }
    }
    if (lastToken === 6) {
      $this.d18_1.h18(7);
    } else if (lastToken === 4) {
      if (!$this.f18_1) {
        invalidTrailingComma($this.d18_1);
      }
      $this.d18_1.h18(7);
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
    var lastToken = $this.d18_1.n18();
    if ($this.d18_1.i18() === 4) {
      $this.d18_1.g17('Unexpected leading comma');
    }
    // Inline function 'kotlin.collections.arrayListOf' call
    var result = ArrayList_init_$Create$();
    while ($this.d18_1.j18()) {
      var element = $this.m18();
      result.e(element);
      lastToken = $this.d18_1.n18();
      if (!(lastToken === 4)) {
        var tmp0 = $this.d18_1;
        // Inline function 'kotlinx.serialization.json.internal.AbstractJsonLexer.require' call
        var condition = lastToken === 9;
        var position = tmp0.d13_1;
        if (!condition) {
          var tmp$ret$1 = 'Expected end of the array or comma';
          tmp0.g17(tmp$ret$1, position);
        }
      }
    }
    if (lastToken === 8) {
      $this.d18_1.h18(9);
    } else if (lastToken === 4) {
      if (!$this.f18_1) {
        invalidTrailingComma($this.d18_1, 'array');
      }
      $this.d18_1.h18(9);
    }
    return new JsonArray(result);
  }
  function readValue($this, isString) {
    var tmp;
    if ($this.e18_1 || !isString) {
      tmp = $this.d18_1.l18();
    } else {
      tmp = $this.d18_1.k18();
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
    this.l19_1 = this$0;
    CoroutineImpl.call(this, resultContinuation);
  }
  protoOf(JsonTreeReader$readDeepRecursive$slambda).q19 = function ($this$DeepRecursiveFunction, it, $completion) {
    var tmp = this.r19($this$DeepRecursiveFunction, it, $completion);
    tmp.a8_1 = Unit_instance;
    tmp.b8_1 = null;
    return tmp.g8();
  };
  protoOf(JsonTreeReader$readDeepRecursive$slambda).m8 = function (p1, p2, $completion) {
    var tmp = p1 instanceof DeepRecursiveScope ? p1 : THROW_CCE();
    return this.q19(tmp, p2 instanceof Unit ? p2 : THROW_CCE(), $completion);
  };
  protoOf(JsonTreeReader$readDeepRecursive$slambda).g8 = function () {
    var suspendResult = this.a8_1;
    $sm: do
      try {
        var tmp = this.y7_1;
        switch (tmp) {
          case 0:
            this.z7_1 = 3;
            this.o19_1 = this.l19_1.d18_1.i18();
            if (this.o19_1 === 1) {
              this.p19_1 = readValue(this.l19_1, true);
              this.y7_1 = 2;
              continue $sm;
            } else {
              if (this.o19_1 === 0) {
                this.p19_1 = readValue(this.l19_1, false);
                this.y7_1 = 2;
                continue $sm;
              } else {
                if (this.o19_1 === 6) {
                  this.y7_1 = 1;
                  suspendResult = readObject_0(this.l19_1, this.m19_1, this);
                  if (suspendResult === get_COROUTINE_SUSPENDED()) {
                    return suspendResult;
                  }
                  continue $sm;
                } else {
                  if (this.o19_1 === 8) {
                    this.p19_1 = readArray(this.l19_1);
                    this.y7_1 = 2;
                    continue $sm;
                  } else {
                    var tmp_0 = this;
                    this.l19_1.d18_1.g17("Can't begin reading element, unexpected token");
                  }
                }
              }
            }

            break;
          case 1:
            this.p19_1 = suspendResult;
            this.y7_1 = 2;
            continue $sm;
          case 2:
            return this.p19_1;
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
  protoOf(JsonTreeReader$readDeepRecursive$slambda).r19 = function ($this$DeepRecursiveFunction, it, completion) {
    var i = new JsonTreeReader$readDeepRecursive$slambda(this.l19_1, completion);
    i.m19_1 = $this$DeepRecursiveFunction;
    i.n19_1 = it;
    return i;
  };
  function JsonTreeReader$readDeepRecursive$slambda_0(this$0, resultContinuation) {
    var i = new JsonTreeReader$readDeepRecursive$slambda(this$0, resultContinuation);
    var l = function ($this$DeepRecursiveFunction, it, $completion) {
      return i.q19($this$DeepRecursiveFunction, it, $completion);
    };
    l.$arity = 2;
    return l;
  }
  function $readObjectCOROUTINE$0(_this__u8e3s4, _this__u8e3s4_0, resultContinuation) {
    CoroutineImpl.call(this, resultContinuation);
    this.w18_1 = _this__u8e3s4;
    this.x18_1 = _this__u8e3s4_0;
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
            tmp_0.y18_1 = this.w18_1;
            this.z18_1 = this.y18_1;
            this.a19_1 = this.z18_1.d18_1.h18(6);
            if (this.z18_1.d18_1.i18() === 4) {
              this.z18_1.d18_1.g17('Unexpected leading comma');
            }

            var tmp_1 = this;
            tmp_1.b19_1 = LinkedHashMap_init_$Create$();
            this.y7_1 = 1;
            continue $sm;
          case 1:
            if (!this.z18_1.d18_1.j18()) {
              this.y7_1 = 4;
              continue $sm;
            }

            this.c19_1 = this.z18_1.e18_1 ? this.z18_1.d18_1.l18() : this.z18_1.d18_1.k18();
            this.z18_1.d18_1.h18(5);
            this.y7_1 = 2;
            suspendResult = this.x18_1.fg(Unit_instance, this);
            if (suspendResult === get_COROUTINE_SUSPENDED()) {
              return suspendResult;
            }

            continue $sm;
          case 2:
            var element = suspendResult;
            var tmp0 = this.b19_1;
            var key = this.c19_1;
            tmp0.c2(key, element);
            this.a19_1 = this.z18_1.d18_1.n18();
            var tmp0_subject = this.a19_1;
            if (tmp0_subject === 4) {
              this.y7_1 = 3;
              continue $sm;
            } else {
              if (tmp0_subject === 7) {
                this.y7_1 = 4;
                continue $sm;
              } else {
                this.z18_1.d18_1.g17('Expected end of the object or comma');
              }
            }

            break;
          case 3:
            this.y7_1 = 1;
            continue $sm;
          case 4:
            if (this.a19_1 === 6) {
              this.z18_1.d18_1.h18(7);
            } else if (this.a19_1 === 4) {
              if (!this.z18_1.f18_1) {
                invalidTrailingComma(this.z18_1.d18_1);
              }
              this.z18_1.d18_1.h18(7);
            }

            return new JsonObject(this.b19_1);
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
    this.d18_1 = lexer;
    this.e18_1 = configuration.d14_1;
    this.f18_1 = configuration.p14_1;
    this.g18_1 = 0;
  }
  protoOf(JsonTreeReader).m18 = function () {
    var token = this.d18_1.i18();
    var tmp;
    if (token === 1) {
      tmp = readValue(this, true);
    } else if (token === 0) {
      tmp = readValue(this, false);
    } else if (token === 6) {
      var tmp_0;
      this.g18_1 = this.g18_1 + 1 | 0;
      if (this.g18_1 === 200) {
        tmp_0 = readDeepRecursive(this);
      } else {
        tmp_0 = readObject(this);
      }
      var result = tmp_0;
      this.g18_1 = this.g18_1 - 1 | 0;
      tmp = result;
    } else if (token === 8) {
      tmp = readArray(this);
    } else {
      this.d18_1.g17('Cannot read Json element because of unexpected ' + tokenDescription(token));
    }
    return tmp;
  };
  function classDiscriminator(_this__u8e3s4, json) {
    var _iterator__ex2g4s = _this__u8e3s4.wj().g();
    while (_iterator__ex2g4s.h()) {
      var annotation = _iterator__ex2g4s.i();
      if (annotation instanceof JsonClassDiscriminator)
        return annotation.s19_1;
    }
    return json.o12_1.k14_1;
  }
  function validateIfSealed(serializer, actualSerializer, classDiscriminator) {
    if (!(serializer instanceof SealedClassSerializer))
      return Unit_instance;
    if (jsonCachedSerialNames(actualSerializer.oi()).p1(classDiscriminator)) {
      var baseName = serializer.oi().sj();
      var actualName = actualSerializer.oi().sj();
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
    var kind = descriptor.tj();
    var tmp;
    if (kind instanceof PolymorphicKind) {
      tmp = true;
    } else {
      tmp = equals(kind, CONTEXTUAL_getInstance());
    }
    if (tmp) {
      throw IllegalArgumentException_init_$Create$('Serializer for ' + actualClass.z8() + " can't be registered as a subclass for polymorphic serialization " + ('because its kind ' + kind.toString() + ' is not concrete. To work with multiple hierarchies, register it as a base class.'));
    }
    if ($this.t19_1)
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
    var last = descriptor.vj();
    if (inductionVariable < last)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        var name = descriptor.xj(i);
        if (name === $this.u19_1) {
          throw IllegalArgumentException_init_$Create$('Polymorphic serializer for ' + toString(actualClass) + " has property '" + name + "' that conflicts " + 'with JSON class discriminator. You can either change class discriminator in JsonConfiguration, ' + 'rename property with @SerialName annotation ' + 'or fall back to array polymorphism');
        }
      }
       while (inductionVariable < last);
  }
  function PolymorphismValidator(useArrayPolymorphism, discriminator) {
    this.t19_1 = useArrayPolymorphism;
    this.u19_1 = discriminator;
  }
  protoOf(PolymorphismValidator).f12 = function (kClass, provider) {
  };
  protoOf(PolymorphismValidator).i12 = function (baseClass, actualClass, actualSerializer) {
    var descriptor = actualSerializer.oi();
    checkKind_0(this, descriptor, actualClass);
    if (!this.t19_1) {
      checkDiscriminatorCollisions(this, descriptor, actualClass);
    }
  };
  protoOf(PolymorphismValidator).j12 = function (baseClass, defaultSerializerProvider) {
  };
  protoOf(PolymorphismValidator).k12 = function (baseClass, defaultDeserializerProvider) {
  };
  function Key() {
  }
  function DescriptorSchemaCache() {
    this.h17_1 = createMapForCache(16);
  }
  protoOf(DescriptorSchemaCache).v19 = function (descriptor, key, value) {
    // Inline function 'kotlin.collections.getOrPut' call
    var this_0 = this.h17_1;
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
  protoOf(DescriptorSchemaCache).i17 = function (descriptor, key, defaultValue) {
    var tmp0_safe_receiver = this.w19(descriptor, key);
    if (tmp0_safe_receiver == null)
      null;
    else {
      // Inline function 'kotlin.let' call
      return tmp0_safe_receiver;
    }
    var value = defaultValue();
    this.v19(descriptor, key, value);
    return value;
  };
  protoOf(DescriptorSchemaCache).w19 = function (descriptor, key) {
    var tmp0_safe_receiver = this.h17_1.v1(descriptor);
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
    this.x19_1 = discriminatorToSkip;
  }
  function trySkip($this, _this__u8e3s4, unknownKey) {
    if (_this__u8e3s4 == null)
      return false;
    if (_this__u8e3s4.x19_1 === unknownKey) {
      _this__u8e3s4.x19_1 = null;
      return true;
    }
    return false;
  }
  function skipLeftoverElements($this, descriptor) {
    while (!($this.gm(descriptor) === -1)) {
    }
  }
  function checkLeadingComma($this) {
    if ($this.x12_1.i18() === 4) {
      $this.x12_1.g17('Unexpected leading comma');
    }
  }
  function decodeMapIndex($this) {
    var hasComma = false;
    var decodingKey = !(($this.z12_1 % 2 | 0) === 0);
    if (decodingKey) {
      if (!($this.z12_1 === -1)) {
        hasComma = $this.x12_1.z19();
      }
    } else {
      $this.x12_1.y19(_Char___init__impl__6a9atx(58));
    }
    var tmp;
    if ($this.x12_1.j18()) {
      if (decodingKey) {
        if ($this.z12_1 === -1) {
          var tmp0 = $this.x12_1;
          // Inline function 'kotlinx.serialization.json.internal.AbstractJsonLexer.require' call
          var condition = !hasComma;
          var position = tmp0.d13_1;
          if (!condition) {
            var tmp$ret$0 = 'Unexpected leading comma';
            tmp0.g17(tmp$ret$0, position);
          }
        } else {
          var tmp3 = $this.x12_1;
          // Inline function 'kotlinx.serialization.json.internal.AbstractJsonLexer.require' call
          var condition_0 = hasComma;
          var position_0 = tmp3.d13_1;
          if (!condition_0) {
            var tmp$ret$2 = 'Expected comma after the key-value pair';
            tmp3.g17(tmp$ret$2, position_0);
          }
        }
      }
      $this.z12_1 = $this.z12_1 + 1 | 0;
      tmp = $this.z12_1;
    } else {
      if (hasComma && !$this.v12_1.o12_1.p14_1) {
        invalidTrailingComma($this.x12_1);
      }
      tmp = -1;
    }
    return tmp;
  }
  function coerceInputValue($this, descriptor, index) {
    var tmp0 = $this.v12_1;
    var tmp$ret$1;
    $l$block_2: {
      // Inline function 'kotlinx.serialization.json.internal.tryCoerceValue' call
      var isOptional = descriptor.bk(index);
      var elementDescriptor = descriptor.ak(index);
      var tmp;
      if (isOptional && !elementDescriptor.oj()) {
        tmp = $this.x12_1.a1a(true);
      } else {
        tmp = false;
      }
      if (tmp) {
        tmp$ret$1 = true;
        break $l$block_2;
      }
      if (equals(elementDescriptor.tj(), ENUM_getInstance())) {
        var tmp_0;
        if (elementDescriptor.oj()) {
          tmp_0 = $this.x12_1.a1a(false);
        } else {
          tmp_0 = false;
        }
        if (tmp_0) {
          tmp$ret$1 = false;
          break $l$block_2;
        }
        var tmp0_elvis_lhs = $this.x12_1.b1a($this.b13_1.d14_1);
        var tmp_1;
        if (tmp0_elvis_lhs == null) {
          tmp$ret$1 = false;
          break $l$block_2;
        } else {
          tmp_1 = tmp0_elvis_lhs;
        }
        var enumValue = tmp_1;
        var enumIndex = getJsonNameIndex(elementDescriptor, tmp0, enumValue);
        var coerceToNull = !tmp0.o12_1.g14_1 && elementDescriptor.oj();
        if (enumIndex === -3 && (isOptional || coerceToNull)) {
          $this.x12_1.k18();
          tmp$ret$1 = true;
          break $l$block_2;
        }
      }
      tmp$ret$1 = false;
    }
    return tmp$ret$1;
  }
  function decodeObjectIndex($this, descriptor) {
    var hasComma = $this.x12_1.z19();
    while ($this.x12_1.j18()) {
      hasComma = false;
      var key = decodeStringKey($this);
      $this.x12_1.y19(_Char___init__impl__6a9atx(58));
      var index = getJsonNameIndex(descriptor, $this.v12_1, key);
      var tmp;
      if (!(index === -3)) {
        var tmp_0;
        if ($this.b13_1.i14_1 && coerceInputValue($this, descriptor, index)) {
          hasComma = $this.x12_1.z19();
          tmp_0 = false;
        } else {
          var tmp0_safe_receiver = $this.c13_1;
          if (tmp0_safe_receiver == null)
            null;
          else {
            tmp0_safe_receiver.d17(index);
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
    if (hasComma && !$this.v12_1.o12_1.p14_1) {
      invalidTrailingComma($this.x12_1);
    }
    var tmp1_safe_receiver = $this.c13_1;
    var tmp2_elvis_lhs = tmp1_safe_receiver == null ? null : tmp1_safe_receiver.e17();
    return tmp2_elvis_lhs == null ? -1 : tmp2_elvis_lhs;
  }
  function handleUnknown($this, key) {
    if ($this.b13_1.c14_1 || trySkip($this, $this.a13_1, key)) {
      $this.x12_1.d1a($this.b13_1.d14_1);
    } else {
      $this.x12_1.c1a(key);
    }
    return $this.x12_1.z19();
  }
  function decodeListIndex($this) {
    var hasComma = $this.x12_1.z19();
    var tmp;
    if ($this.x12_1.j18()) {
      if (!($this.z12_1 === -1) && !hasComma) {
        $this.x12_1.g17('Expected end of the array or comma');
      }
      $this.z12_1 = $this.z12_1 + 1 | 0;
      tmp = $this.z12_1;
    } else {
      if (hasComma && !$this.v12_1.o12_1.p14_1) {
        invalidTrailingComma($this.x12_1, 'array');
      }
      tmp = -1;
    }
    return tmp;
  }
  function decodeStringKey($this) {
    var tmp;
    if ($this.b13_1.d14_1) {
      tmp = $this.x12_1.f1a();
    } else {
      tmp = $this.x12_1.e1a();
    }
    return tmp;
  }
  function StreamingJsonDecoder(json, mode, lexer, descriptor, discriminatorHolder) {
    AbstractDecoder.call(this);
    this.v12_1 = json;
    this.w12_1 = mode;
    this.x12_1 = lexer;
    this.y12_1 = this.v12_1.em();
    this.z12_1 = -1;
    this.a13_1 = discriminatorHolder;
    this.b13_1 = this.v12_1.o12_1;
    this.c13_1 = this.b13_1.g14_1 ? null : new JsonElementMarker(descriptor);
  }
  protoOf(StreamingJsonDecoder).s14 = function () {
    return this.v12_1;
  };
  protoOf(StreamingJsonDecoder).em = function () {
    return this.y12_1;
  };
  protoOf(StreamingJsonDecoder).t14 = function () {
    return (new JsonTreeReader(this.v12_1.o12_1, this.x12_1)).m18();
  };
  protoOf(StreamingJsonDecoder).ol = function (deserializer) {
    try {
      var tmp;
      if (!(deserializer instanceof AbstractPolymorphicSerializer)) {
        tmp = true;
      } else {
        tmp = this.v12_1.o12_1.j14_1;
      }
      if (tmp) {
        return deserializer.qi(this);
      }
      var discriminator = classDiscriminator(deserializer.oi(), this.v12_1);
      var tmp0_elvis_lhs = this.x12_1.g1a(discriminator, this.b13_1.d14_1);
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
            tmp_1 = this.s14().o12_1.j14_1;
          }
          if (tmp_1) {
            tmp$ret$0 = tmp1.qi(this);
            break $l$block;
          }
          var discriminator_0 = classDiscriminator(tmp1.oi(), this.s14());
          var tmp0 = this.t14();
          // Inline function 'kotlinx.serialization.json.internal.cast' call
          var serialName = tmp1.oi().sj();
          if (!(tmp0 instanceof JsonObject)) {
            var tmp_2 = getKClass(JsonObject).z8();
            var tmp_3 = getKClassFromExpression(tmp0).z8();
            var tmp$ret$1 = this.x12_1.e13_1.t17();
            throw JsonDecodingException_0(-1, 'Expected ' + tmp_2 + ', but had ' + tmp_3 + ' as the serialized body of ' + serialName + ' at element: ' + tmp$ret$1, toString(tmp0));
          }
          var jsonTree = tmp0;
          var tmp0_safe_receiver = jsonTree.ob(discriminator_0);
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
          tmp$ret$0 = readPolymorphicJson(this.s14(), discriminator_0, jsonTree, actualSerializer);
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
          this.x12_1.g17(message, VOID, hint);
        } else {
          throw $p;
        }
        tmp_7 = tmp_8;
      }
      var tmp_9 = tmp_7;
      var actualSerializer_0 = isInterface(tmp_9, DeserializationStrategy) ? tmp_9 : THROW_CCE();
      this.a13_1 = new DiscriminatorHolder(discriminator);
      return actualSerializer_0.qi(this);
    } catch ($p) {
      if ($p instanceof MissingFieldException) {
        var e = $p;
        if (contains_0(ensureNotNull(e.message), 'at path'))
          throw e;
        throw new MissingFieldException(e.ij_1, plus(e.message, ' at path: ') + this.x12_1.e13_1.t17(), e);
      } else {
        throw $p;
      }
    }
  };
  protoOf(StreamingJsonDecoder).pl = function (descriptor) {
    var newMode = switchMode(this.v12_1, descriptor);
    this.x12_1.e13_1.o17(descriptor);
    this.x12_1.y19(newMode.j1a_1);
    checkLeadingComma(this);
    var tmp;
    switch (newMode.e2_1) {
      case 1:
      case 2:
      case 3:
        tmp = new StreamingJsonDecoder(this.v12_1, newMode, this.x12_1, descriptor, this.a13_1);
        break;
      default:
        var tmp_0;
        if (this.w12_1.equals(newMode) && this.v12_1.o12_1.g14_1) {
          tmp_0 = this;
        } else {
          tmp_0 = new StreamingJsonDecoder(this.v12_1, newMode, this.x12_1, descriptor, this.a13_1);
        }

        tmp = tmp_0;
        break;
    }
    return tmp;
  };
  protoOf(StreamingJsonDecoder).ql = function (descriptor) {
    if (this.v12_1.o12_1.c14_1 && descriptor.vj() === 0) {
      skipLeftoverElements(this, descriptor);
    }
    if (this.x12_1.z19() && !this.v12_1.o12_1.p14_1) {
      invalidTrailingComma(this.x12_1, '');
    }
    this.x12_1.y19(this.w12_1.k1a_1);
    this.x12_1.e13_1.s17();
  };
  protoOf(StreamingJsonDecoder).al = function () {
    var tmp;
    var tmp0_safe_receiver = this.c13_1;
    var tmp1_elvis_lhs = tmp0_safe_receiver == null ? null : tmp0_safe_receiver.c17_1;
    if (!(tmp1_elvis_lhs == null ? false : tmp1_elvis_lhs)) {
      tmp = !this.x12_1.l1a();
    } else {
      tmp = false;
    }
    return tmp;
  };
  protoOf(StreamingJsonDecoder).bl = function () {
    return null;
  };
  protoOf(StreamingJsonDecoder).bm = function (descriptor, index, deserializer, previousValue) {
    var isMapKey = this.w12_1.equals(WriteMode_MAP_getInstance()) && (index & 1) === 0;
    if (isMapKey) {
      this.x12_1.e13_1.r17();
    }
    var value = protoOf(AbstractDecoder).bm.call(this, descriptor, index, deserializer, previousValue);
    if (isMapKey) {
      this.x12_1.e13_1.q17(value);
    }
    return value;
  };
  protoOf(StreamingJsonDecoder).gm = function (descriptor) {
    var index;
    switch (this.w12_1.e2_1) {
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
    if (!this.w12_1.equals(WriteMode_MAP_getInstance())) {
      this.x12_1.e13_1.p17(index);
    }
    return index;
  };
  protoOf(StreamingJsonDecoder).cl = function () {
    return this.x12_1.m1a();
  };
  protoOf(StreamingJsonDecoder).dl = function () {
    var value = this.x12_1.e15();
    if (!value.equals(toLong(value.x2()))) {
      this.x12_1.g17("Failed to parse byte for input '" + value.toString() + "'");
    }
    return value.x2();
  };
  protoOf(StreamingJsonDecoder).el = function () {
    var value = this.x12_1.e15();
    if (!value.equals(toLong(value.y2()))) {
      this.x12_1.g17("Failed to parse short for input '" + value.toString() + "'");
    }
    return value.y2();
  };
  protoOf(StreamingJsonDecoder).fl = function () {
    var value = this.x12_1.e15();
    if (!value.equals(toLong(value.a1()))) {
      this.x12_1.g17("Failed to parse int for input '" + value.toString() + "'");
    }
    return value.a1();
  };
  protoOf(StreamingJsonDecoder).gl = function () {
    return this.x12_1.e15();
  };
  protoOf(StreamingJsonDecoder).hl = function () {
    var tmp0 = this.x12_1;
    var tmp$ret$4;
    $l$block: {
      // Inline function 'kotlinx.serialization.json.internal.parseString' call
      var input = tmp0.l18();
      try {
        // Inline function 'kotlin.text.toFloat' call
        // Inline function 'kotlin.js.unsafeCast' call
        // Inline function 'kotlin.js.asDynamic' call
        tmp$ret$4 = toDouble(input);
        break $l$block;
      } catch ($p) {
        if ($p instanceof IllegalArgumentException) {
          var e = $p;
          tmp0.g17("Failed to parse type '" + 'float' + "' for input '" + input + "'");
        } else {
          throw $p;
        }
      }
    }
    var result = tmp$ret$4;
    var specialFp = this.v12_1.o12_1.l14_1;
    if (specialFp || isFinite(result))
      return result;
    throwInvalidFloatingPointDecoded(this.x12_1, result);
  };
  protoOf(StreamingJsonDecoder).il = function () {
    var tmp0 = this.x12_1;
    var tmp$ret$1;
    $l$block: {
      // Inline function 'kotlinx.serialization.json.internal.parseString' call
      var input = tmp0.l18();
      try {
        tmp$ret$1 = toDouble(input);
        break $l$block;
      } catch ($p) {
        if ($p instanceof IllegalArgumentException) {
          var e = $p;
          tmp0.g17("Failed to parse type '" + 'double' + "' for input '" + input + "'");
        } else {
          throw $p;
        }
      }
    }
    var result = tmp$ret$1;
    var specialFp = this.v12_1.o12_1.l14_1;
    if (specialFp || isFinite_0(result))
      return result;
    throwInvalidFloatingPointDecoded(this.x12_1, result);
  };
  protoOf(StreamingJsonDecoder).jl = function () {
    var string = this.x12_1.l18();
    if (!(string.length === 1)) {
      this.x12_1.g17("Expected single char, but got '" + string + "'");
    }
    return charSequenceGet(string, 0);
  };
  protoOf(StreamingJsonDecoder).kl = function () {
    var tmp;
    if (this.b13_1.d14_1) {
      tmp = this.x12_1.f1a();
    } else {
      tmp = this.x12_1.k18();
    }
    return tmp;
  };
  protoOf(StreamingJsonDecoder).ml = function (descriptor) {
    return get_isUnsignedNumber(descriptor) ? new JsonDecoderForUnsignedTypes(this.x12_1, this.v12_1) : protoOf(AbstractDecoder).ml.call(this, descriptor);
  };
  protoOf(StreamingJsonDecoder).ll = function (enumDescriptor) {
    return getJsonNameIndexOrThrow(enumDescriptor, this.v12_1, this.kl(), ' at path ' + this.x12_1.e13_1.t17());
  };
  function JsonDecoderForUnsignedTypes(lexer, json) {
    AbstractDecoder.call(this);
    this.n1a_1 = lexer;
    this.o1a_1 = json.em();
  }
  protoOf(JsonDecoderForUnsignedTypes).em = function () {
    return this.o1a_1;
  };
  protoOf(JsonDecoderForUnsignedTypes).gm = function (descriptor) {
    var message = 'unsupported';
    throw IllegalStateException_init_$Create$(toString(message));
  };
  protoOf(JsonDecoderForUnsignedTypes).fl = function () {
    var tmp0 = this.n1a_1;
    var tmp$ret$2;
    $l$block: {
      // Inline function 'kotlinx.serialization.json.internal.parseString' call
      var input = tmp0.l18();
      try {
        // Inline function 'kotlin.UInt.toInt' call
        var this_0 = toUInt(input);
        tmp$ret$2 = _UInt___get_data__impl__f0vqqw(this_0);
        break $l$block;
      } catch ($p) {
        if ($p instanceof IllegalArgumentException) {
          var e = $p;
          tmp0.g17("Failed to parse type '" + 'UInt' + "' for input '" + input + "'");
        } else {
          throw $p;
        }
      }
    }
    return tmp$ret$2;
  };
  protoOf(JsonDecoderForUnsignedTypes).gl = function () {
    var tmp0 = this.n1a_1;
    var tmp$ret$2;
    $l$block: {
      // Inline function 'kotlinx.serialization.json.internal.parseString' call
      var input = tmp0.l18();
      try {
        // Inline function 'kotlin.ULong.toLong' call
        var this_0 = toULong(input);
        tmp$ret$2 = _ULong___get_data__impl__fggpzb(this_0);
        break $l$block;
      } catch ($p) {
        if ($p instanceof IllegalArgumentException) {
          var e = $p;
          tmp0.g17("Failed to parse type '" + 'ULong' + "' for input '" + input + "'");
        } else {
          throw $p;
        }
      }
    }
    return tmp$ret$2;
  };
  protoOf(JsonDecoderForUnsignedTypes).dl = function () {
    var tmp0 = this.n1a_1;
    var tmp$ret$2;
    $l$block: {
      // Inline function 'kotlinx.serialization.json.internal.parseString' call
      var input = tmp0.l18();
      try {
        // Inline function 'kotlin.UByte.toByte' call
        var this_0 = toUByte(input);
        tmp$ret$2 = _UByte___get_data__impl__jof9qr(this_0);
        break $l$block;
      } catch ($p) {
        if ($p instanceof IllegalArgumentException) {
          var e = $p;
          tmp0.g17("Failed to parse type '" + 'UByte' + "' for input '" + input + "'");
        } else {
          throw $p;
        }
      }
    }
    return tmp$ret$2;
  };
  protoOf(JsonDecoderForUnsignedTypes).el = function () {
    var tmp0 = this.n1a_1;
    var tmp$ret$2;
    $l$block: {
      // Inline function 'kotlinx.serialization.json.internal.parseString' call
      var input = tmp0.l18();
      try {
        // Inline function 'kotlin.UShort.toShort' call
        var this_0 = toUShort(input);
        tmp$ret$2 = _UShort___get_data__impl__g0245(this_0);
        break $l$block;
      } catch ($p) {
        if ($p instanceof IllegalArgumentException) {
          var e = $p;
          tmp0.g17("Failed to parse type '" + 'UShort' + "' for input '" + input + "'");
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
    $this.u17_1.a16();
    $this.tm(discriminator);
    $this.u17_1.d16(_Char___init__impl__6a9atx(58));
    $this.u17_1.c16();
    $this.tm(serialName);
  }
  function StreamingJsonEncoder(composer, json, mode, modeReuseCache) {
    AbstractEncoder.call(this);
    this.u17_1 = composer;
    this.v17_1 = json;
    this.w17_1 = mode;
    this.x17_1 = modeReuseCache;
    this.y17_1 = this.v17_1.em();
    this.z17_1 = this.v17_1.o12_1;
    this.a18_1 = false;
    this.b18_1 = null;
    this.c18_1 = null;
    var i = this.w17_1.e2_1;
    if (!(this.x17_1 == null)) {
      if (!(this.x17_1[i] === null) || !(this.x17_1[i] === this)) {
        this.x17_1[i] = this;
      }
    }
  }
  protoOf(StreamingJsonEncoder).s14 = function () {
    return this.v17_1;
  };
  protoOf(StreamingJsonEncoder).em = function () {
    return this.y17_1;
  };
  protoOf(StreamingJsonEncoder).mn = function (descriptor, index) {
    return this.z17_1.b14_1;
  };
  protoOf(StreamingJsonEncoder).hn = function (serializer, value) {
    $l$block: {
      // Inline function 'kotlinx.serialization.json.internal.encodePolymorphically' call
      if (this.s14().o12_1.j14_1) {
        serializer.pi(this, value);
        break $l$block;
      }
      var isPolymorphicSerializer = serializer instanceof AbstractPolymorphicSerializer;
      var tmp;
      if (isPolymorphicSerializer) {
        tmp = !this.s14().o12_1.r14_1.equals(ClassDiscriminatorMode_NONE_getInstance());
      } else {
        var tmp_0;
        switch (this.s14().o12_1.r14_1.e2_1) {
          case 0:
          case 2:
            tmp_0 = false;
            break;
          case 1:
            // Inline function 'kotlin.let' call

            var it = serializer.oi().tj();
            tmp_0 = equals(it, CLASS_getInstance()) || equals(it, OBJECT_getInstance());
            break;
          default:
            noWhenBranchMatchedException();
            break;
        }
        tmp = tmp_0;
      }
      var needDiscriminator = tmp;
      var baseClassDiscriminator = needDiscriminator ? classDiscriminator(serializer.oi(), this.s14()) : null;
      var tmp_1;
      if (isPolymorphicSerializer) {
        var casted = serializer instanceof AbstractPolymorphicSerializer ? serializer : THROW_CCE();
        $l$block_0: {
          // Inline function 'kotlin.requireNotNull' call
          if (value == null) {
            var message = 'Value for serializer ' + toString(serializer.oi()) + ' should always be non-null. Please report issue to the kotlinx.serialization tracker.';
            throw IllegalArgumentException_init_$Create$(toString(message));
          } else {
            break $l$block_0;
          }
        }
        var actual = findPolymorphicSerializer_0(casted, this, value);
        if (!(baseClassDiscriminator == null)) {
          access$validateIfSealed$tPolymorphicKt(serializer, actual, baseClassDiscriminator);
        }
        checkKind(actual.oi().tj());
        tmp_1 = isInterface(actual, SerializationStrategy) ? actual : THROW_CCE();
      } else {
        tmp_1 = serializer;
      }
      var actualSerializer = tmp_1;
      if (!(baseClassDiscriminator == null)) {
        var serialName = actualSerializer.oi().sj();
        this.b18_1 = baseClassDiscriminator;
        this.c18_1 = serialName;
      }
      actualSerializer.pi(this, value);
    }
  };
  protoOf(StreamingJsonEncoder).pl = function (descriptor) {
    var newMode = switchMode(this.v17_1, descriptor);
    if (!(newMode.j1a_1 === _Char___init__impl__6a9atx(0))) {
      this.u17_1.d16(newMode.j1a_1);
      this.u17_1.y15();
    }
    var discriminator = this.b18_1;
    if (!(discriminator == null)) {
      var tmp0_elvis_lhs = this.c18_1;
      encodeTypeInfo(this, discriminator, tmp0_elvis_lhs == null ? descriptor.sj() : tmp0_elvis_lhs);
      this.b18_1 = null;
      this.c18_1 = null;
    }
    if (this.w17_1.equals(newMode)) {
      return this;
    }
    var tmp1_safe_receiver = this.x17_1;
    var tmp2_elvis_lhs = tmp1_safe_receiver == null ? null : tmp1_safe_receiver[newMode.e2_1];
    return tmp2_elvis_lhs == null ? new StreamingJsonEncoder(this.u17_1, this.v17_1, newMode, this.x17_1) : tmp2_elvis_lhs;
  };
  protoOf(StreamingJsonEncoder).ql = function (descriptor) {
    if (!(this.w17_1.k1a_1 === _Char___init__impl__6a9atx(0))) {
      this.u17_1.z15();
      this.u17_1.b16();
      this.u17_1.d16(this.w17_1.k1a_1);
    }
  };
  protoOf(StreamingJsonEncoder).im = function (descriptor, index) {
    switch (this.w17_1.e2_1) {
      case 1:
        if (!this.u17_1.x15_1) {
          this.u17_1.d16(_Char___init__impl__6a9atx(44));
        }

        this.u17_1.a16();
        break;
      case 2:
        if (!this.u17_1.x15_1) {
          var tmp = this;
          var tmp_0;
          if ((index % 2 | 0) === 0) {
            this.u17_1.d16(_Char___init__impl__6a9atx(44));
            this.u17_1.a16();
            tmp_0 = true;
          } else {
            this.u17_1.d16(_Char___init__impl__6a9atx(58));
            this.u17_1.c16();
            tmp_0 = false;
          }
          tmp.a18_1 = tmp_0;
        } else {
          this.a18_1 = true;
          this.u17_1.a16();
        }

        break;
      case 3:
        if (index === 0)
          this.a18_1 = true;
        if (index === 1) {
          this.u17_1.d16(_Char___init__impl__6a9atx(44));
          this.u17_1.c16();
          this.a18_1 = false;
        }

        break;
      default:
        if (!this.u17_1.x15_1) {
          this.u17_1.d16(_Char___init__impl__6a9atx(44));
        }

        this.u17_1.a16();
        this.tm(getJsonElementName(descriptor, this.v17_1, index));
        this.u17_1.d16(_Char___init__impl__6a9atx(58));
        this.u17_1.c16();
        break;
    }
    return true;
  };
  protoOf(StreamingJsonEncoder).in = function (descriptor, index, serializer, value) {
    if (!(value == null) || this.z17_1.g14_1) {
      protoOf(AbstractEncoder).in.call(this, descriptor, index, serializer, value);
    }
  };
  protoOf(StreamingJsonEncoder).vm = function (descriptor) {
    var tmp;
    if (get_isUnsignedNumber(descriptor)) {
      // Inline function 'kotlinx.serialization.json.internal.StreamingJsonEncoder.composerAs' call
      var tmp_0;
      var tmp_1 = this.u17_1;
      if (tmp_1 instanceof ComposerForUnsignedNumbers) {
        tmp_0 = this.u17_1;
      } else {
        var tmp1 = this.u17_1.w15_1;
        var p1 = this.a18_1;
        tmp_0 = new ComposerForUnsignedNumbers(tmp1, p1);
      }
      var tmp$ret$1 = tmp_0;
      tmp = new StreamingJsonEncoder(tmp$ret$1, this.v17_1, this.w17_1, null);
    } else if (get_isUnquotedLiteral(descriptor)) {
      // Inline function 'kotlinx.serialization.json.internal.StreamingJsonEncoder.composerAs' call
      var tmp_2;
      var tmp_3 = this.u17_1;
      if (tmp_3 instanceof ComposerForUnquotedLiterals) {
        tmp_2 = this.u17_1;
      } else {
        var tmp4 = this.u17_1.w15_1;
        var p1_0 = this.a18_1;
        tmp_2 = new ComposerForUnquotedLiterals(tmp4, p1_0);
      }
      var tmp$ret$3 = tmp_2;
      tmp = new StreamingJsonEncoder(tmp$ret$3, this.v17_1, this.w17_1, null);
    } else if (!(this.b18_1 == null)) {
      // Inline function 'kotlin.apply' call
      this.c18_1 = descriptor.sj();
      tmp = this;
    } else {
      tmp = protoOf(AbstractEncoder).vm.call(this, descriptor);
    }
    return tmp;
  };
  protoOf(StreamingJsonEncoder).km = function () {
    this.u17_1.f16('null');
  };
  protoOf(StreamingJsonEncoder).lm = function (value) {
    if (this.a18_1) {
      this.tm(value.toString());
    } else {
      this.u17_1.o16(value);
    }
  };
  protoOf(StreamingJsonEncoder).mm = function (value) {
    if (this.a18_1) {
      this.tm(value.toString());
    } else {
      this.u17_1.j16(value);
    }
  };
  protoOf(StreamingJsonEncoder).nm = function (value) {
    if (this.a18_1) {
      this.tm(value.toString());
    } else {
      this.u17_1.l16(value);
    }
  };
  protoOf(StreamingJsonEncoder).om = function (value) {
    if (this.a18_1) {
      this.tm(value.toString());
    } else {
      this.u17_1.m16(value);
    }
  };
  protoOf(StreamingJsonEncoder).pm = function (value) {
    if (this.a18_1) {
      this.tm(value.toString());
    } else {
      this.u17_1.n16(value);
    }
  };
  protoOf(StreamingJsonEncoder).qm = function (value) {
    if (this.a18_1) {
      this.tm(value.toString());
    } else {
      this.u17_1.h16(value);
    }
    if (!this.z17_1.l14_1 && !isFinite(value)) {
      throw InvalidFloatingPointEncoded(value, toString(this.u17_1.w15_1));
    }
  };
  protoOf(StreamingJsonEncoder).rm = function (value) {
    if (this.a18_1) {
      this.tm(value.toString());
    } else {
      this.u17_1.i16(value);
    }
    if (!this.z17_1.l14_1 && !isFinite_0(value)) {
      throw InvalidFloatingPointEncoded(value, toString(this.u17_1.w15_1));
    }
  };
  protoOf(StreamingJsonEncoder).sm = function (value) {
    this.tm(toString_1(value));
  };
  protoOf(StreamingJsonEncoder).tm = function (value) {
    return this.u17_1.p16(value);
  };
  protoOf(StreamingJsonEncoder).um = function (enumDescriptor, index) {
    this.tm(enumDescriptor.xj(index));
  };
  function get_isUnsignedNumber(_this__u8e3s4) {
    _init_properties_StreamingJsonEncoder_kt__pn1bsi();
    return _this__u8e3s4.uj() && get_unsignedNumberDescriptors().p1(_this__u8e3s4);
  }
  function get_isUnquotedLiteral(_this__u8e3s4) {
    _init_properties_StreamingJsonEncoder_kt__pn1bsi();
    return _this__u8e3s4.uj() && equals(_this__u8e3s4, get_jsonUnquotedLiteralDescriptor());
  }
  var properties_initialized_StreamingJsonEncoder_kt_6ifwwk;
  function _init_properties_StreamingJsonEncoder_kt__pn1bsi() {
    if (!properties_initialized_StreamingJsonEncoder_kt_6ifwwk) {
      properties_initialized_StreamingJsonEncoder_kt_6ifwwk = true;
      unsignedNumberDescriptors = setOf([serializer_1(Companion_getInstance_0()).oi(), serializer_0(Companion_getInstance()).oi(), serializer_2(Companion_getInstance_1()).oi(), serializer_3(Companion_getInstance_2()).oi()]);
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
    throw JsonDecodingException_0(-1, "Failed to parse literal '" + literal.toString() + "' as " + type + ' value at element: ' + $this.v1a(tag), toString($this.w1a()));
  }
  function AbstractJsonTreeDecoder(json, value, polymorphicDiscriminator) {
    polymorphicDiscriminator = polymorphicDiscriminator === VOID ? null : polymorphicDiscriminator;
    NamedValueDecoder.call(this);
    this.r1a_1 = json;
    this.s1a_1 = value;
    this.t1a_1 = polymorphicDiscriminator;
    this.u1a_1 = this.s14().o12_1;
  }
  protoOf(AbstractJsonTreeDecoder).s14 = function () {
    return this.r1a_1;
  };
  protoOf(AbstractJsonTreeDecoder).s1 = function () {
    return this.s1a_1;
  };
  protoOf(AbstractJsonTreeDecoder).em = function () {
    return this.s14().em();
  };
  protoOf(AbstractJsonTreeDecoder).w1a = function () {
    var tmp0_safe_receiver = this.vz();
    var tmp;
    if (tmp0_safe_receiver == null) {
      tmp = null;
    } else {
      // Inline function 'kotlin.let' call
      tmp = this.x1a(tmp0_safe_receiver);
    }
    var tmp1_elvis_lhs = tmp;
    return tmp1_elvis_lhs == null ? this.s1() : tmp1_elvis_lhs;
  };
  protoOf(AbstractJsonTreeDecoder).v1a = function (currentTag) {
    return this.xz() + ('.' + currentTag);
  };
  protoOf(AbstractJsonTreeDecoder).t14 = function () {
    return this.w1a();
  };
  protoOf(AbstractJsonTreeDecoder).ol = function (deserializer) {
    var tmp$ret$0;
    $l$block: {
      // Inline function 'kotlinx.serialization.json.internal.decodeSerializableValuePolymorphic' call
      var tmp;
      if (!(deserializer instanceof AbstractPolymorphicSerializer)) {
        tmp = true;
      } else {
        tmp = this.s14().o12_1.j14_1;
      }
      if (tmp) {
        tmp$ret$0 = deserializer.qi(this);
        break $l$block;
      }
      var discriminator = classDiscriminator(deserializer.oi(), this.s14());
      var tmp0 = this.t14();
      // Inline function 'kotlinx.serialization.json.internal.cast' call
      var serialName = deserializer.oi().sj();
      if (!(tmp0 instanceof JsonObject)) {
        var tmp_0 = getKClass(JsonObject).z8();
        var tmp_1 = getKClassFromExpression(tmp0).z8();
        var tmp$ret$1 = this.xz();
        throw JsonDecodingException_0(-1, 'Expected ' + tmp_0 + ', but had ' + tmp_1 + ' as the serialized body of ' + serialName + ' at element: ' + tmp$ret$1, toString(tmp0));
      }
      var jsonTree = tmp0;
      var tmp0_safe_receiver = jsonTree.ob(discriminator);
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
      tmp$ret$0 = readPolymorphicJson(this.s14(), discriminator, jsonTree, actualSerializer);
    }
    return tmp$ret$0;
  };
  protoOf(AbstractJsonTreeDecoder).wz = function (parentName, childName) {
    return childName;
  };
  protoOf(AbstractJsonTreeDecoder).pl = function (descriptor) {
    var currentObject = this.w1a();
    var tmp0_subject = descriptor.tj();
    var tmp;
    var tmp_0;
    if (equals(tmp0_subject, LIST_getInstance())) {
      tmp_0 = true;
    } else {
      tmp_0 = tmp0_subject instanceof PolymorphicKind;
    }
    if (tmp_0) {
      var tmp_1 = this.s14();
      // Inline function 'kotlinx.serialization.json.internal.AbstractJsonTreeDecoder.cast' call
      // Inline function 'kotlinx.serialization.json.internal.cast' call
      var serialName = descriptor.sj();
      if (!(currentObject instanceof JsonArray)) {
        var tmp_2 = getKClass(JsonArray).z8();
        var tmp_3 = getKClassFromExpression(currentObject).z8();
        var tmp$ret$0 = this.xz();
        throw JsonDecodingException_0(-1, 'Expected ' + tmp_2 + ', but had ' + tmp_3 + ' as the serialized body of ' + serialName + ' at element: ' + tmp$ret$0, toString(currentObject));
      }
      tmp = new JsonTreeListDecoder(tmp_1, currentObject);
    } else {
      if (equals(tmp0_subject, MAP_getInstance())) {
        // Inline function 'kotlinx.serialization.json.internal.selectMapMode' call
        var this_0 = this.s14();
        var keyDescriptor = carrierDescriptor(descriptor.ak(0), this_0.em());
        var keyKind = keyDescriptor.tj();
        var tmp_4;
        var tmp_5;
        if (keyKind instanceof PrimitiveKind) {
          tmp_5 = true;
        } else {
          tmp_5 = equals(keyKind, ENUM_getInstance());
        }
        if (tmp_5) {
          var tmp_6 = this.s14();
          // Inline function 'kotlinx.serialization.json.internal.AbstractJsonTreeDecoder.cast' call
          // Inline function 'kotlinx.serialization.json.internal.cast' call
          var serialName_0 = descriptor.sj();
          if (!(currentObject instanceof JsonObject)) {
            var tmp_7 = getKClass(JsonObject).z8();
            var tmp_8 = getKClassFromExpression(currentObject).z8();
            var tmp$ret$3 = this.xz();
            throw JsonDecodingException_0(-1, 'Expected ' + tmp_7 + ', but had ' + tmp_8 + ' as the serialized body of ' + serialName_0 + ' at element: ' + tmp$ret$3, toString(currentObject));
          }
          tmp_4 = new JsonTreeMapDecoder(tmp_6, currentObject);
        } else {
          if (this_0.o12_1.e14_1) {
            var tmp_9 = this.s14();
            // Inline function 'kotlinx.serialization.json.internal.AbstractJsonTreeDecoder.cast' call
            // Inline function 'kotlinx.serialization.json.internal.cast' call
            var serialName_1 = descriptor.sj();
            if (!(currentObject instanceof JsonArray)) {
              var tmp_10 = getKClass(JsonArray).z8();
              var tmp_11 = getKClassFromExpression(currentObject).z8();
              var tmp$ret$7 = this.xz();
              throw JsonDecodingException_0(-1, 'Expected ' + tmp_10 + ', but had ' + tmp_11 + ' as the serialized body of ' + serialName_1 + ' at element: ' + tmp$ret$7, toString(currentObject));
            }
            tmp_4 = new JsonTreeListDecoder(tmp_9, currentObject);
          } else {
            throw InvalidKeyKindException(keyDescriptor);
          }
        }
        tmp = tmp_4;
      } else {
        var tmp_12 = this.s14();
        // Inline function 'kotlinx.serialization.json.internal.AbstractJsonTreeDecoder.cast' call
        // Inline function 'kotlinx.serialization.json.internal.cast' call
        var serialName_2 = descriptor.sj();
        if (!(currentObject instanceof JsonObject)) {
          var tmp_13 = getKClass(JsonObject).z8();
          var tmp_14 = getKClassFromExpression(currentObject).z8();
          var tmp$ret$12 = this.xz();
          throw JsonDecodingException_0(-1, 'Expected ' + tmp_13 + ', but had ' + tmp_14 + ' as the serialized body of ' + serialName_2 + ' at element: ' + tmp$ret$12, toString(currentObject));
        }
        tmp = new JsonTreeDecoder(tmp_12, currentObject, this.t1a_1);
      }
    }
    return tmp;
  };
  protoOf(AbstractJsonTreeDecoder).ql = function (descriptor) {
  };
  protoOf(AbstractJsonTreeDecoder).al = function () {
    var tmp = this.w1a();
    return !(tmp instanceof JsonNull);
  };
  protoOf(AbstractJsonTreeDecoder).y1a = function (tag, enumDescriptor) {
    var tmp = this.s14();
    // Inline function 'kotlinx.serialization.json.internal.AbstractJsonTreeDecoder.getPrimitiveValue' call
    var tmp1 = this.x1a(tag);
    // Inline function 'kotlinx.serialization.json.internal.AbstractJsonTreeDecoder.cast' call
    // Inline function 'kotlinx.serialization.json.internal.cast' call
    var serialName = enumDescriptor.sj();
    if (!(tmp1 instanceof JsonPrimitive)) {
      var tmp_0 = getKClass(JsonPrimitive).z8();
      var tmp_1 = getKClassFromExpression(tmp1).z8();
      var tmp$ret$0 = this.v1a(tag);
      throw JsonDecodingException_0(-1, 'Expected ' + tmp_0 + ', but had ' + tmp_1 + ' as the serialized body of ' + serialName + ' at element: ' + tmp$ret$0, toString(tmp1));
    }
    return getJsonNameIndexOrThrow(enumDescriptor, tmp, tmp1.x14());
  };
  protoOf(AbstractJsonTreeDecoder).j10 = function (tag, enumDescriptor) {
    return this.y1a((!(tag == null) ? typeof tag === 'string' : false) ? tag : THROW_CCE(), enumDescriptor);
  };
  protoOf(AbstractJsonTreeDecoder).z1a = function (tag) {
    return !(this.x1a(tag) === JsonNull_getInstance());
  };
  protoOf(AbstractJsonTreeDecoder).zz = function (tag) {
    return this.z1a((!(tag == null) ? typeof tag === 'string' : false) ? tag : THROW_CCE());
  };
  protoOf(AbstractJsonTreeDecoder).a1b = function (tag) {
    var tmp$ret$4;
    $l$block: {
      // Inline function 'kotlinx.serialization.json.internal.AbstractJsonTreeDecoder.getPrimitiveValue' call
      // Inline function 'kotlinx.serialization.json.internal.AbstractJsonTreeDecoder.cast' call
      // Inline function 'kotlinx.serialization.json.internal.cast' call
      var value = this.x1a(tag);
      if (!(value instanceof JsonPrimitive)) {
        var tmp = getKClass(JsonPrimitive).z8();
        var tmp_0 = getKClassFromExpression(value).z8();
        var tmp$ret$0 = this.v1a(tag);
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
  protoOf(AbstractJsonTreeDecoder).a10 = function (tag) {
    return this.a1b((!(tag == null) ? typeof tag === 'string' : false) ? tag : THROW_CCE());
  };
  protoOf(AbstractJsonTreeDecoder).b1b = function (tag) {
    var tmp$ret$4;
    $l$block: {
      // Inline function 'kotlinx.serialization.json.internal.AbstractJsonTreeDecoder.getPrimitiveValue' call
      // Inline function 'kotlinx.serialization.json.internal.AbstractJsonTreeDecoder.cast' call
      // Inline function 'kotlinx.serialization.json.internal.cast' call
      var value = this.x1a(tag);
      if (!(value instanceof JsonPrimitive)) {
        var tmp = getKClass(JsonPrimitive).z8();
        var tmp_0 = getKClassFromExpression(value).z8();
        var tmp$ret$0 = this.v1a(tag);
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
  protoOf(AbstractJsonTreeDecoder).b10 = function (tag) {
    return this.b1b((!(tag == null) ? typeof tag === 'string' : false) ? tag : THROW_CCE());
  };
  protoOf(AbstractJsonTreeDecoder).c1b = function (tag) {
    var tmp$ret$4;
    $l$block: {
      // Inline function 'kotlinx.serialization.json.internal.AbstractJsonTreeDecoder.getPrimitiveValue' call
      // Inline function 'kotlinx.serialization.json.internal.AbstractJsonTreeDecoder.cast' call
      // Inline function 'kotlinx.serialization.json.internal.cast' call
      var value = this.x1a(tag);
      if (!(value instanceof JsonPrimitive)) {
        var tmp = getKClass(JsonPrimitive).z8();
        var tmp_0 = getKClassFromExpression(value).z8();
        var tmp$ret$0 = this.v1a(tag);
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
  protoOf(AbstractJsonTreeDecoder).c10 = function (tag) {
    return this.c1b((!(tag == null) ? typeof tag === 'string' : false) ? tag : THROW_CCE());
  };
  protoOf(AbstractJsonTreeDecoder).d1b = function (tag) {
    var tmp$ret$4;
    $l$block: {
      // Inline function 'kotlinx.serialization.json.internal.AbstractJsonTreeDecoder.getPrimitiveValue' call
      // Inline function 'kotlinx.serialization.json.internal.AbstractJsonTreeDecoder.cast' call
      // Inline function 'kotlinx.serialization.json.internal.cast' call
      var value = this.x1a(tag);
      if (!(value instanceof JsonPrimitive)) {
        var tmp = getKClass(JsonPrimitive).z8();
        var tmp_0 = getKClassFromExpression(value).z8();
        var tmp$ret$0 = this.v1a(tag);
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
  protoOf(AbstractJsonTreeDecoder).d10 = function (tag) {
    return this.d1b((!(tag == null) ? typeof tag === 'string' : false) ? tag : THROW_CCE());
  };
  protoOf(AbstractJsonTreeDecoder).e1b = function (tag) {
    var tmp$ret$4;
    $l$block: {
      // Inline function 'kotlinx.serialization.json.internal.AbstractJsonTreeDecoder.getPrimitiveValue' call
      // Inline function 'kotlinx.serialization.json.internal.AbstractJsonTreeDecoder.cast' call
      // Inline function 'kotlinx.serialization.json.internal.cast' call
      var value = this.x1a(tag);
      if (!(value instanceof JsonPrimitive)) {
        var tmp = getKClass(JsonPrimitive).z8();
        var tmp_0 = getKClassFromExpression(value).z8();
        var tmp$ret$0 = this.v1a(tag);
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
  protoOf(AbstractJsonTreeDecoder).e10 = function (tag) {
    return this.e1b((!(tag == null) ? typeof tag === 'string' : false) ? tag : THROW_CCE());
  };
  protoOf(AbstractJsonTreeDecoder).f1b = function (tag) {
    var tmp$ret$4;
    $l$block: {
      // Inline function 'kotlinx.serialization.json.internal.AbstractJsonTreeDecoder.getPrimitiveValue' call
      // Inline function 'kotlinx.serialization.json.internal.AbstractJsonTreeDecoder.cast' call
      // Inline function 'kotlinx.serialization.json.internal.cast' call
      var value = this.x1a(tag);
      if (!(value instanceof JsonPrimitive)) {
        var tmp = getKClass(JsonPrimitive).z8();
        var tmp_0 = getKClassFromExpression(value).z8();
        var tmp$ret$0 = this.v1a(tag);
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
    var specialFp = this.s14().o12_1.l14_1;
    if (specialFp || isFinite(result))
      return result;
    throw InvalidFloatingPointDecoded(result, tag, toString(this.w1a()));
  };
  protoOf(AbstractJsonTreeDecoder).f10 = function (tag) {
    return this.f1b((!(tag == null) ? typeof tag === 'string' : false) ? tag : THROW_CCE());
  };
  protoOf(AbstractJsonTreeDecoder).g1b = function (tag) {
    var tmp$ret$4;
    $l$block: {
      // Inline function 'kotlinx.serialization.json.internal.AbstractJsonTreeDecoder.getPrimitiveValue' call
      // Inline function 'kotlinx.serialization.json.internal.AbstractJsonTreeDecoder.cast' call
      // Inline function 'kotlinx.serialization.json.internal.cast' call
      var value = this.x1a(tag);
      if (!(value instanceof JsonPrimitive)) {
        var tmp = getKClass(JsonPrimitive).z8();
        var tmp_0 = getKClassFromExpression(value).z8();
        var tmp$ret$0 = this.v1a(tag);
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
    var specialFp = this.s14().o12_1.l14_1;
    if (specialFp || isFinite_0(result))
      return result;
    throw InvalidFloatingPointDecoded(result, tag, toString(this.w1a()));
  };
  protoOf(AbstractJsonTreeDecoder).g10 = function (tag) {
    return this.g1b((!(tag == null) ? typeof tag === 'string' : false) ? tag : THROW_CCE());
  };
  protoOf(AbstractJsonTreeDecoder).h1b = function (tag) {
    var tmp$ret$4;
    $l$block: {
      // Inline function 'kotlinx.serialization.json.internal.AbstractJsonTreeDecoder.getPrimitiveValue' call
      // Inline function 'kotlinx.serialization.json.internal.AbstractJsonTreeDecoder.cast' call
      // Inline function 'kotlinx.serialization.json.internal.cast' call
      var value = this.x1a(tag);
      if (!(value instanceof JsonPrimitive)) {
        var tmp = getKClass(JsonPrimitive).z8();
        var tmp_0 = getKClassFromExpression(value).z8();
        var tmp$ret$0 = this.v1a(tag);
        throw JsonDecodingException_0(-1, 'Expected ' + tmp + ', but had ' + tmp_0 + ' as the serialized body of ' + 'char' + ' at element: ' + tmp$ret$0, toString(value));
      }
      var literal = value;
      try {
        var tmp0_elvis_lhs = new Char(single(literal.x14()));
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
  protoOf(AbstractJsonTreeDecoder).h10 = function (tag) {
    return this.h1b((!(tag == null) ? typeof tag === 'string' : false) ? tag : THROW_CCE());
  };
  protoOf(AbstractJsonTreeDecoder).i1b = function (tag) {
    // Inline function 'kotlinx.serialization.json.internal.AbstractJsonTreeDecoder.cast' call
    // Inline function 'kotlinx.serialization.json.internal.cast' call
    var value = this.x1a(tag);
    if (!(value instanceof JsonPrimitive)) {
      var tmp = getKClass(JsonPrimitive).z8();
      var tmp_0 = getKClassFromExpression(value).z8();
      var tmp$ret$0 = this.v1a(tag);
      throw JsonDecodingException_0(-1, 'Expected ' + tmp + ', but had ' + tmp_0 + ' as the serialized body of ' + 'string' + ' at element: ' + tmp$ret$0, toString(value));
    }
    var value_0 = value;
    if (!(value_0 instanceof JsonLiteral))
      throw JsonDecodingException_0(-1, "Expected string value for a non-null key '" + tag + "', got null literal instead at element: " + this.v1a(tag), toString(this.w1a()));
    if (!value_0.z14_1 && !this.s14().o12_1.d14_1) {
      throw JsonDecodingException_0(-1, "String literal for key '" + tag + "' should be quoted at element: " + this.v1a(tag) + ".\nUse 'isLenient = true' in 'Json {}' builder to accept non-compliant JSON.", toString(this.w1a()));
    }
    return value_0.b15_1;
  };
  protoOf(AbstractJsonTreeDecoder).i10 = function (tag) {
    return this.i1b((!(tag == null) ? typeof tag === 'string' : false) ? tag : THROW_CCE());
  };
  protoOf(AbstractJsonTreeDecoder).j1b = function (tag, inlineDescriptor) {
    var tmp;
    if (get_isUnsignedNumber(inlineDescriptor)) {
      var tmp_0 = this.s14();
      // Inline function 'kotlinx.serialization.json.internal.AbstractJsonTreeDecoder.getPrimitiveValue' call
      var tmp1 = this.x1a(tag);
      // Inline function 'kotlinx.serialization.json.internal.AbstractJsonTreeDecoder.cast' call
      // Inline function 'kotlinx.serialization.json.internal.cast' call
      var serialName = inlineDescriptor.sj();
      if (!(tmp1 instanceof JsonPrimitive)) {
        var tmp_1 = getKClass(JsonPrimitive).z8();
        var tmp_2 = getKClassFromExpression(tmp1).z8();
        var tmp$ret$0 = this.v1a(tag);
        throw JsonDecodingException_0(-1, 'Expected ' + tmp_1 + ', but had ' + tmp_2 + ' as the serialized body of ' + serialName + ' at element: ' + tmp$ret$0, toString(tmp1));
      }
      var lexer = StringJsonLexer_0(tmp_0, tmp1.x14());
      tmp = new JsonDecoderForUnsignedTypes(lexer, this.s14());
    } else {
      tmp = protoOf(NamedValueDecoder).k10.call(this, tag, inlineDescriptor);
    }
    return tmp;
  };
  protoOf(AbstractJsonTreeDecoder).k10 = function (tag, inlineDescriptor) {
    return this.j1b((!(tag == null) ? typeof tag === 'string' : false) ? tag : THROW_CCE(), inlineDescriptor);
  };
  protoOf(AbstractJsonTreeDecoder).ml = function (descriptor) {
    return !(this.vz() == null) ? protoOf(NamedValueDecoder).ml.call(this, descriptor) : (new JsonPrimitiveDecoder(this.s14(), this.s1(), this.t1a_1)).ml(descriptor);
  };
  function coerceInputValue_0($this, descriptor, index, tag) {
    var tmp0 = $this.s14();
    var tmp$ret$1;
    $l$block_2: {
      // Inline function 'kotlinx.serialization.json.internal.tryCoerceValue' call
      var isOptional = descriptor.bk(index);
      var elementDescriptor = descriptor.ak(index);
      var tmp;
      if (isOptional && !elementDescriptor.oj()) {
        var tmp_0 = $this.x1a(tag);
        tmp = tmp_0 instanceof JsonNull;
      } else {
        tmp = false;
      }
      if (tmp) {
        tmp$ret$1 = true;
        break $l$block_2;
      }
      if (equals(elementDescriptor.tj(), ENUM_getInstance())) {
        var tmp_1;
        if (elementDescriptor.oj()) {
          var tmp_2 = $this.x1a(tag);
          tmp_1 = tmp_2 instanceof JsonNull;
        } else {
          tmp_1 = false;
        }
        if (tmp_1) {
          tmp$ret$1 = false;
          break $l$block_2;
        }
        var tmp_3 = $this.x1a(tag);
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
        var coerceToNull = !tmp0.o12_1.g14_1 && elementDescriptor.oj();
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
    $this.t1b_1 = (!$this.s14().o12_1.g14_1 && !descriptor.bk(index) && descriptor.ak(index).oj());
    return $this.t1b_1;
  }
  function JsonTreeDecoder(json, value, polymorphicDiscriminator, polyDescriptor) {
    polymorphicDiscriminator = polymorphicDiscriminator === VOID ? null : polymorphicDiscriminator;
    polyDescriptor = polyDescriptor === VOID ? null : polyDescriptor;
    AbstractJsonTreeDecoder.call(this, json, value, polymorphicDiscriminator);
    this.q1b_1 = value;
    this.r1b_1 = polyDescriptor;
    this.s1b_1 = 0;
    this.t1b_1 = false;
  }
  protoOf(JsonTreeDecoder).s1 = function () {
    return this.q1b_1;
  };
  protoOf(JsonTreeDecoder).gm = function (descriptor) {
    while (this.s1b_1 < descriptor.vj()) {
      var _unary__edvuaz = this.s1b_1;
      this.s1b_1 = _unary__edvuaz + 1 | 0;
      var name = this.qz(descriptor, _unary__edvuaz);
      var index = this.s1b_1 - 1 | 0;
      this.t1b_1 = false;
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
        tmp = !this.u1a_1.i14_1 || !coerceInputValue_0(this, descriptor, index, name);
      } else {
        tmp = false;
      }
      if (tmp) {
        return index;
      }
    }
    return -1;
  };
  protoOf(JsonTreeDecoder).al = function () {
    return !this.t1b_1 && protoOf(AbstractJsonTreeDecoder).al.call(this);
  };
  protoOf(JsonTreeDecoder).rz = function (descriptor, index) {
    var strategy = namingStrategy(descriptor, this.s14());
    var baseName = descriptor.xj(index);
    if (strategy == null) {
      if (!this.u1a_1.m14_1)
        return baseName;
      if (this.s1().w1().p1(baseName))
        return baseName;
    }
    var deserializationNamesMap_0 = deserializationNamesMap(this.s14(), descriptor);
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
    var fallbackName = strategy == null ? null : strategy.k17(descriptor, index, baseName);
    return fallbackName == null ? baseName : fallbackName;
  };
  protoOf(JsonTreeDecoder).x1a = function (tag) {
    return getValue(this.s1(), tag);
  };
  protoOf(JsonTreeDecoder).pl = function (descriptor) {
    if (descriptor === this.r1b_1) {
      var tmp = this.s14();
      var tmp1 = this.w1a();
      // Inline function 'kotlinx.serialization.json.internal.AbstractJsonTreeDecoder.cast' call
      // Inline function 'kotlinx.serialization.json.internal.cast' call
      var serialName = this.r1b_1.sj();
      if (!(tmp1 instanceof JsonObject)) {
        var tmp_0 = getKClass(JsonObject).z8();
        var tmp_1 = getKClassFromExpression(tmp1).z8();
        var tmp$ret$0 = this.xz();
        throw JsonDecodingException_0(-1, 'Expected ' + tmp_0 + ', but had ' + tmp_1 + ' as the serialized body of ' + serialName + ' at element: ' + tmp$ret$0, toString(tmp1));
      }
      return new JsonTreeDecoder(tmp, tmp1, this.t1a_1, this.r1b_1);
    }
    return protoOf(AbstractJsonTreeDecoder).pl.call(this, descriptor);
  };
  protoOf(JsonTreeDecoder).ql = function (descriptor) {
    var tmp;
    if (this.u1a_1.c14_1) {
      tmp = true;
    } else {
      var tmp_0 = descriptor.tj();
      tmp = tmp_0 instanceof PolymorphicKind;
    }
    if (tmp)
      return Unit_instance;
    var strategy = namingStrategy(descriptor, this.s14());
    var tmp_1;
    if (strategy == null && !this.u1a_1.m14_1) {
      tmp_1 = jsonCachedSerialNames(descriptor);
    } else if (!(strategy == null)) {
      tmp_1 = deserializationNamesMap(this.s14(), descriptor).w1();
    } else {
      var tmp_2 = jsonCachedSerialNames(descriptor);
      var tmp0_safe_receiver = get_schemaCache(this.s14()).w19(descriptor, get_JsonDeserializationNamesKey());
      // Inline function 'kotlin.collections.orEmpty' call
      var tmp0_elvis_lhs = tmp0_safe_receiver == null ? null : tmp0_safe_receiver.w1();
      var tmp$ret$0 = tmp0_elvis_lhs == null ? emptySet() : tmp0_elvis_lhs;
      tmp_1 = plus_0(tmp_2, tmp$ret$0);
    }
    var names = tmp_1;
    var _iterator__ex2g4s = this.s1().w1().g();
    while (_iterator__ex2g4s.h()) {
      var key = _iterator__ex2g4s.i();
      if (!names.p1(key) && !(key === this.t1a_1)) {
        throw UnknownKeyException(key, this.s1().toString());
      }
    }
  };
  function JsonTreeListDecoder(json, value) {
    AbstractJsonTreeDecoder.call(this, json, value);
    this.a1c_1 = value;
    this.b1c_1 = this.a1c_1.j();
    this.c1c_1 = -1;
  }
  protoOf(JsonTreeListDecoder).s1 = function () {
    return this.a1c_1;
  };
  protoOf(JsonTreeListDecoder).rz = function (descriptor, index) {
    return index.toString();
  };
  protoOf(JsonTreeListDecoder).x1a = function (tag) {
    return this.a1c_1.k(toInt(tag));
  };
  protoOf(JsonTreeListDecoder).gm = function (descriptor) {
    while (this.c1c_1 < (this.b1c_1 - 1 | 0)) {
      this.c1c_1 = this.c1c_1 + 1 | 0;
      return this.c1c_1;
    }
    return -1;
  };
  function JsonPrimitiveDecoder(json, value, polymorphicDiscriminator) {
    polymorphicDiscriminator = polymorphicDiscriminator === VOID ? null : polymorphicDiscriminator;
    AbstractJsonTreeDecoder.call(this, json, value, polymorphicDiscriminator);
    this.j1c_1 = value;
    this.l10('primitive');
  }
  protoOf(JsonPrimitiveDecoder).s1 = function () {
    return this.j1c_1;
  };
  protoOf(JsonPrimitiveDecoder).gm = function (descriptor) {
    return 0;
  };
  protoOf(JsonPrimitiveDecoder).x1a = function (tag) {
    // Inline function 'kotlin.require' call
    if (!(tag === 'primitive')) {
      var message = "This input can only handle primitives with 'primitive' tag";
      throw IllegalArgumentException_init_$Create$(toString(message));
    }
    return this.j1c_1;
  };
  function JsonTreeMapDecoder(json, value) {
    JsonTreeDecoder.call(this, json, value);
    this.u1c_1 = value;
    this.v1c_1 = toList(this.u1c_1.w1());
    this.w1c_1 = imul(this.v1c_1.j(), 2);
    this.x1c_1 = -1;
  }
  protoOf(JsonTreeMapDecoder).s1 = function () {
    return this.u1c_1;
  };
  protoOf(JsonTreeMapDecoder).rz = function (descriptor, index) {
    var i = index / 2 | 0;
    return this.v1c_1.k(i);
  };
  protoOf(JsonTreeMapDecoder).gm = function (descriptor) {
    while (this.x1c_1 < (this.w1c_1 - 1 | 0)) {
      this.x1c_1 = this.x1c_1 + 1 | 0;
      return this.x1c_1;
    }
    return -1;
  };
  protoOf(JsonTreeMapDecoder).x1a = function (tag) {
    return (this.x1c_1 % 2 | 0) === 0 ? JsonPrimitive_0(tag) : getValue(this.u1c_1, tag);
  };
  protoOf(JsonTreeMapDecoder).ql = function (descriptor) {
  };
  function readPolymorphicJson(_this__u8e3s4, discriminator, element, deserializer) {
    return (new JsonTreeDecoder(_this__u8e3s4, element, discriminator, deserializer.oi())).ol(deserializer);
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
    this.j1a_1 = begin;
    this.k1a_1 = end;
  }
  function switchMode(_this__u8e3s4, desc) {
    var tmp0_subject = desc.tj();
    var tmp;
    if (tmp0_subject instanceof PolymorphicKind) {
      tmp = WriteMode_POLY_OBJ_getInstance();
    } else {
      if (equals(tmp0_subject, LIST_getInstance())) {
        tmp = WriteMode_LIST_getInstance();
      } else {
        if (equals(tmp0_subject, MAP_getInstance())) {
          // Inline function 'kotlinx.serialization.json.internal.selectMapMode' call
          var keyDescriptor = carrierDescriptor(desc.ak(0), _this__u8e3s4.em());
          var keyKind = keyDescriptor.tj();
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
            if (_this__u8e3s4.o12_1.e14_1) {
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
    if (equals(_this__u8e3s4.tj(), CONTEXTUAL_getInstance())) {
      var tmp0_safe_receiver = getContextualDescriptor(module_0, _this__u8e3s4);
      var tmp1_elvis_lhs = tmp0_safe_receiver == null ? null : carrierDescriptor(tmp0_safe_receiver, module_0);
      tmp = tmp1_elvis_lhs == null ? _this__u8e3s4 : tmp1_elvis_lhs;
    } else if (_this__u8e3s4.uj()) {
      tmp = carrierDescriptor(_this__u8e3s4.ak(0), module_0);
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
    $this.y1c(lastPosition, current);
    return appendEsc($this, current + 1 | 0);
  }
  function decodedString($this, lastPosition, currentPosition) {
    $this.y1c(lastPosition, currentPosition);
    var result = $this.g13_1.toString();
    $this.g13_1.qa(0);
    return result;
  }
  function takePeeked($this) {
    // Inline function 'kotlin.also' call
    var this_0 = ensureNotNull($this.f13_1);
    $this.f13_1 = null;
    return this_0;
  }
  function wasUnquotedString($this) {
    return !(charSequenceGet($this.z1c(), $this.d13_1 - 1 | 0) === _Char___init__impl__6a9atx(34));
  }
  function appendEsc($this, startPosition) {
    var currentPosition = startPosition;
    currentPosition = $this.a1d(currentPosition);
    if (currentPosition === -1) {
      $this.g17('Expected escape sequence to continue, got EOF');
    }
    var tmp = $this.z1c();
    var _unary__edvuaz = currentPosition;
    currentPosition = _unary__edvuaz + 1 | 0;
    var currentChar = charSequenceGet(tmp, _unary__edvuaz);
    if (currentChar === _Char___init__impl__6a9atx(117)) {
      return appendHex($this, $this.z1c(), currentPosition);
    }
    // Inline function 'kotlin.code' call
    var tmp$ret$0 = Char__toInt_impl_vasixd(currentChar);
    var c = escapeToChar(tmp$ret$0);
    if (c === _Char___init__impl__6a9atx(0)) {
      $this.g17("Invalid escaped char '" + toString_1(currentChar) + "'");
    }
    $this.g13_1.g7(c);
    return currentPosition;
  }
  function appendHex($this, source, startPos) {
    if ((startPos + 4 | 0) >= charSequenceLength(source)) {
      $this.d13_1 = startPos;
      $this.b1d();
      if (($this.d13_1 + 4 | 0) >= charSequenceLength(source)) {
        $this.g17('Unexpected EOF during unicode escape');
      }
      return appendHex($this, source, $this.d13_1);
    }
    $this.g13_1.g7(numberToChar((((fromHexChar($this, source, startPos) << 12) + (fromHexChar($this, source, startPos + 1 | 0) << 8) | 0) + (fromHexChar($this, source, startPos + 2 | 0) << 4) | 0) + fromHexChar($this, source, startPos + 3 | 0) | 0));
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
      $this.g17("Invalid toHexChar char '" + toString_1(character) + "' in unicode escape");
    }
    return tmp;
  }
  function consumeBoolean2($this, start) {
    var current = $this.a1d(start);
    if (current >= charSequenceLength($this.z1c()) || current === -1) {
      $this.g17('EOF');
    }
    var tmp = $this.z1c();
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
        $this.g17("Expected valid boolean literal prefix, but had '" + $this.l18() + "'");
      }
    }
    return tmp_0;
  }
  function consumeBooleanLiteral($this, literalSuffix, current) {
    if ((charSequenceLength($this.z1c()) - current | 0) < literalSuffix.length) {
      $this.g17('Unexpected end of boolean literal');
    }
    var inductionVariable = 0;
    var last = charSequenceLength(literalSuffix) - 1 | 0;
    if (inductionVariable <= last)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        var expected = charSequenceGet(literalSuffix, i);
        var actual = charSequenceGet($this.z1c(), current + i | 0);
        // Inline function 'kotlin.code' call
        var tmp = Char__toInt_impl_vasixd(expected);
        // Inline function 'kotlin.code' call
        if (!(tmp === (Char__toInt_impl_vasixd(actual) | 32))) {
          $this.g17("Expected valid boolean literal prefix, but had '" + $this.l18() + "'");
        }
      }
       while (inductionVariable <= last);
    $this.d13_1 = current + literalSuffix.length | 0;
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
    this.d13_1 = 0;
    this.e13_1 = new JsonPath();
    this.f13_1 = null;
    this.g13_1 = StringBuilder_init_$Create$();
  }
  protoOf(AbstractJsonLexer).b1d = function () {
  };
  protoOf(AbstractJsonLexer).z19 = function () {
    var current = this.c1d();
    var source = this.z1c();
    if (current >= charSequenceLength(source) || current === -1)
      return false;
    if (charSequenceGet(source, current) === _Char___init__impl__6a9atx(44)) {
      this.d13_1 = this.d13_1 + 1 | 0;
      return true;
    }
    return false;
  };
  protoOf(AbstractJsonLexer).d1d = function (c) {
    return c === _Char___init__impl__6a9atx(125) || c === _Char___init__impl__6a9atx(93) || (c === _Char___init__impl__6a9atx(58) || c === _Char___init__impl__6a9atx(44)) ? false : true;
  };
  protoOf(AbstractJsonLexer).h13 = function () {
    var nextToken = this.n18();
    if (!(nextToken === 10)) {
      this.g17('Expected EOF after parsing, but had ' + toString_1(charSequenceGet(this.z1c(), this.d13_1 - 1 | 0)) + ' instead');
    }
  };
  protoOf(AbstractJsonLexer).h18 = function (expected) {
    var token = this.n18();
    if (!(token === expected)) {
      this.e1d(expected);
    }
    return token;
  };
  protoOf(AbstractJsonLexer).f1d = function (expected) {
    if (this.d13_1 > 0 && expected === _Char___init__impl__6a9atx(34)) {
      var tmp$ret$1;
      $l$block: {
        // Inline function 'kotlinx.serialization.json.internal.AbstractJsonLexer.withPositionRollback' call
        var snapshot = this.d13_1;
        try {
          this.d13_1 = this.d13_1 - 1 | 0;
          tmp$ret$1 = this.l18();
          break $l$block;
        }finally {
          this.d13_1 = snapshot;
        }
      }
      var inputLiteral = tmp$ret$1;
      if (inputLiteral === 'null') {
        this.f17("Expected string literal but 'null' literal was found", this.d13_1 - 1 | 0, "Use 'coerceInputValues = true' in 'Json {}' builder to coerce nulls if property has a default value.");
      }
    }
    this.e1d(charToTokenClass(expected));
  };
  protoOf(AbstractJsonLexer).g1d = function (expectedToken, wasConsumed) {
    var expected = tokenDescription(expectedToken);
    var position = wasConsumed ? this.d13_1 - 1 | 0 : this.d13_1;
    var s = this.d13_1 === charSequenceLength(this.z1c()) || position < 0 ? 'EOF' : toString_1(charSequenceGet(this.z1c(), position));
    this.g17('Expected ' + expected + ", but had '" + s + "' instead", position);
  };
  protoOf(AbstractJsonLexer).e1d = function (expectedToken, wasConsumed, $super) {
    wasConsumed = wasConsumed === VOID ? true : wasConsumed;
    return $super === VOID ? this.g1d(expectedToken, wasConsumed) : $super.g1d.call(this, expectedToken, wasConsumed);
  };
  protoOf(AbstractJsonLexer).i18 = function () {
    var source = this.z1c();
    var cpos = this.d13_1;
    $l$loop_0: while (true) {
      cpos = this.a1d(cpos);
      if (cpos === -1)
        break $l$loop_0;
      var ch = charSequenceGet(source, cpos);
      if (ch === _Char___init__impl__6a9atx(32) || ch === _Char___init__impl__6a9atx(10) || ch === _Char___init__impl__6a9atx(13) || ch === _Char___init__impl__6a9atx(9)) {
        cpos = cpos + 1 | 0;
        continue $l$loop_0;
      }
      this.d13_1 = cpos;
      return charToTokenClass(ch);
    }
    this.d13_1 = cpos;
    return 10;
  };
  protoOf(AbstractJsonLexer).a1a = function (doConsume) {
    var current = this.c1d();
    current = this.a1d(current);
    var len = charSequenceLength(this.z1c()) - current | 0;
    if (len < 4 || current === -1)
      return false;
    var inductionVariable = 0;
    if (inductionVariable <= 3)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        if (!(charSequenceGet('null', i) === charSequenceGet(this.z1c(), current + i | 0)))
          return false;
      }
       while (inductionVariable <= 3);
    if (len > 4 && charToTokenClass(charSequenceGet(this.z1c(), current + 4 | 0)) === 0)
      return false;
    if (doConsume) {
      this.d13_1 = current + 4 | 0;
    }
    return true;
  };
  protoOf(AbstractJsonLexer).l1a = function (doConsume, $super) {
    doConsume = doConsume === VOID ? true : doConsume;
    return $super === VOID ? this.a1a(doConsume) : $super.a1a.call(this, doConsume);
  };
  protoOf(AbstractJsonLexer).b1a = function (isLenient) {
    var token = this.i18();
    var tmp;
    if (isLenient) {
      if (!(token === 1) && !(token === 0))
        return null;
      tmp = this.l18();
    } else {
      if (!(token === 1))
        return null;
      tmp = this.k18();
    }
    var string = tmp;
    this.f13_1 = string;
    return string;
  };
  protoOf(AbstractJsonLexer).h1d = function () {
    this.f13_1 = null;
  };
  protoOf(AbstractJsonLexer).i1d = function (startPos, endPos) {
    // Inline function 'kotlin.text.substring' call
    var this_0 = this.z1c();
    return toString(charSequenceSubSequence(this_0, startPos, endPos));
  };
  protoOf(AbstractJsonLexer).k18 = function () {
    if (!(this.f13_1 == null)) {
      return takePeeked(this);
    }
    return this.e1a();
  };
  protoOf(AbstractJsonLexer).consumeString2 = function (source, startPosition, current) {
    var currentPosition = current;
    var lastPosition = startPosition;
    var char = charSequenceGet(source, currentPosition);
    var usedAppend = false;
    while (!(char === _Char___init__impl__6a9atx(34))) {
      if (char === _Char___init__impl__6a9atx(92)) {
        usedAppend = true;
        currentPosition = this.a1d(appendEscape(this, lastPosition, currentPosition));
        if (currentPosition === -1) {
          this.g17('Unexpected EOF', currentPosition);
        }
        lastPosition = currentPosition;
      } else {
        currentPosition = currentPosition + 1 | 0;
        if (currentPosition >= charSequenceLength(source)) {
          usedAppend = true;
          this.y1c(lastPosition, currentPosition);
          currentPosition = this.a1d(currentPosition);
          if (currentPosition === -1) {
            this.g17('Unexpected EOF', currentPosition);
          }
          lastPosition = currentPosition;
        }
      }
      char = charSequenceGet(source, currentPosition);
    }
    var tmp;
    if (!usedAppend) {
      tmp = this.i1d(lastPosition, currentPosition);
    } else {
      tmp = decodedString(this, lastPosition, currentPosition);
    }
    var string = tmp;
    this.d13_1 = currentPosition + 1 | 0;
    return string;
  };
  protoOf(AbstractJsonLexer).f1a = function () {
    var result = this.l18();
    if (result === 'null' && wasUnquotedString(this)) {
      this.g17("Unexpected 'null' value instead of string literal");
    }
    return result;
  };
  protoOf(AbstractJsonLexer).l18 = function () {
    if (!(this.f13_1 == null)) {
      return takePeeked(this);
    }
    var current = this.c1d();
    if (current >= charSequenceLength(this.z1c()) || current === -1) {
      this.g17('EOF', current);
    }
    var token = charToTokenClass(charSequenceGet(this.z1c(), current));
    if (token === 1) {
      return this.k18();
    }
    if (!(token === 0)) {
      this.g17('Expected beginning of the string, but got ' + toString_1(charSequenceGet(this.z1c(), current)));
    }
    var usedAppend = false;
    while (charToTokenClass(charSequenceGet(this.z1c(), current)) === 0) {
      current = current + 1 | 0;
      if (current >= charSequenceLength(this.z1c())) {
        usedAppend = true;
        this.y1c(this.d13_1, current);
        var eof = this.a1d(current);
        if (eof === -1) {
          this.d13_1 = current;
          return decodedString(this, 0, 0);
        } else {
          current = eof;
        }
      }
    }
    var tmp;
    if (!usedAppend) {
      tmp = this.i1d(this.d13_1, current);
    } else {
      tmp = decodedString(this, this.d13_1, current);
    }
    var result = tmp;
    this.d13_1 = current;
    return result;
  };
  protoOf(AbstractJsonLexer).y1c = function (fromIndex, toIndex) {
    this.g13_1.ka(this.z1c(), fromIndex, toIndex);
  };
  protoOf(AbstractJsonLexer).d1a = function (allowLenientStrings) {
    // Inline function 'kotlin.collections.mutableListOf' call
    var tokenStack = ArrayList_init_$Create$();
    var lastToken = this.i18();
    if (!(lastToken === 8) && !(lastToken === 6)) {
      this.l18();
      return Unit_instance;
    }
    $l$loop: while (true) {
      lastToken = this.i18();
      if (lastToken === 1) {
        if (allowLenientStrings)
          this.l18();
        else
          this.e1a();
        continue $l$loop;
      }
      var tmp0_subject = lastToken;
      if (tmp0_subject === 8 || tmp0_subject === 6) {
        tokenStack.e(lastToken);
      } else if (tmp0_subject === 9) {
        if (!(last(tokenStack) === 8))
          throw JsonDecodingException_0(this.d13_1, 'found ] instead of } at path: ' + this.e13_1.toString(), this.z1c());
        removeLast(tokenStack);
      } else if (tmp0_subject === 7) {
        if (!(last(tokenStack) === 6))
          throw JsonDecodingException_0(this.d13_1, 'found } instead of ] at path: ' + this.e13_1.toString(), this.z1c());
        removeLast(tokenStack);
      } else if (tmp0_subject === 10) {
        this.g17('Unexpected end of input due to malformed JSON during ignoring unknown keys');
      }
      this.n18();
      if (tokenStack.j() === 0)
        return Unit_instance;
    }
  };
  protoOf(AbstractJsonLexer).toString = function () {
    return "JsonReader(source='" + toString(this.z1c()) + "', currentPosition=" + this.d13_1 + ')';
  };
  protoOf(AbstractJsonLexer).c1a = function (key) {
    var processed = this.i1d(0, this.d13_1);
    var lastIndexOf_0 = lastIndexOf(processed, key);
    this.f17("Encountered an unknown key '" + key + "'", lastIndexOf_0, "Use 'ignoreUnknownKeys = true' in 'Json {}' builder to ignore unknown keys.");
  };
  protoOf(AbstractJsonLexer).f17 = function (message, position, hint) {
    var tmp;
    // Inline function 'kotlin.text.isEmpty' call
    if (charSequenceLength(hint) === 0) {
      tmp = '';
    } else {
      tmp = '\n' + hint;
    }
    var hintMessage = tmp;
    throw JsonDecodingException_0(position, message + ' at path: ' + this.e13_1.t17() + hintMessage, this.z1c());
  };
  protoOf(AbstractJsonLexer).g17 = function (message, position, hint, $super) {
    position = position === VOID ? this.d13_1 : position;
    hint = hint === VOID ? '' : hint;
    return $super === VOID ? this.f17(message, position, hint) : $super.f17.call(this, message, position, hint);
  };
  protoOf(AbstractJsonLexer).e15 = function () {
    var current = this.c1d();
    current = this.a1d(current);
    if (current >= charSequenceLength(this.z1c()) || current === -1) {
      this.g17('EOF');
    }
    var tmp;
    if (charSequenceGet(this.z1c(), current) === _Char___init__impl__6a9atx(34)) {
      current = current + 1 | 0;
      if (current === charSequenceLength(this.z1c())) {
        this.g17('EOF');
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
    $l$loop_4: while (!(current === charSequenceLength(this.z1c()))) {
      var ch = charSequenceGet(this.z1c(), current);
      if ((ch === _Char___init__impl__6a9atx(101) || ch === _Char___init__impl__6a9atx(69)) && !hasExponent) {
        if (current === start) {
          this.g17('Unexpected symbol ' + toString_1(ch) + ' in numeric literal');
        }
        isExponentPositive = true;
        hasExponent = true;
        current = current + 1 | 0;
        continue $l$loop_4;
      }
      if (ch === _Char___init__impl__6a9atx(45) && hasExponent) {
        if (current === start) {
          this.g17("Unexpected symbol '-' in numeric literal");
        }
        isExponentPositive = false;
        current = current + 1 | 0;
        continue $l$loop_4;
      }
      if (ch === _Char___init__impl__6a9atx(43) && hasExponent) {
        if (current === start) {
          this.g17("Unexpected symbol '+' in numeric literal");
        }
        isExponentPositive = true;
        current = current + 1 | 0;
        continue $l$loop_4;
      }
      if (ch === _Char___init__impl__6a9atx(45)) {
        if (!(current === start)) {
          this.g17("Unexpected symbol '-' in numeric literal");
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
        this.g17("Unexpected symbol '" + toString_1(ch) + "' in numeric literal");
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
        this.g17('Numeric value overflow');
      }
    }
    var hasChars = !(current === start);
    if (start === current || (isNegative && start === (current - 1 | 0))) {
      this.g17('Expected numeric literal');
    }
    if (hasQuotation) {
      if (!hasChars) {
        this.g17('EOF');
      }
      if (!(charSequenceGet(this.z1c(), current) === _Char___init__impl__6a9atx(34))) {
        this.g17('Expected closing quotation mark');
      }
      current = current + 1 | 0;
    }
    this.d13_1 = current;
    if (hasExponent) {
      var doubleAccumulator = accumulator.z2() * consumeNumericLiteral$calculateExponent(exponentAccumulator, isExponentPositive);
      if (doubleAccumulator > (new Long(-1, 2147483647)).z2() || doubleAccumulator < (new Long(0, -2147483648)).z2()) {
        this.g17('Numeric value overflow');
      }
      // Inline function 'kotlin.math.floor' call
      if (!(Math.floor(doubleAccumulator) === doubleAccumulator)) {
        this.g17("Can't convert " + doubleAccumulator + ' to Long');
      }
      accumulator = numberToLong(doubleAccumulator);
    }
    var tmp_0;
    if (isNegative) {
      tmp_0 = accumulator;
    } else if (!accumulator.equals(new Long(0, -2147483648))) {
      tmp_0 = accumulator.p2();
    } else {
      this.g17('Numeric value overflow');
    }
    return tmp_0;
  };
  protoOf(AbstractJsonLexer).m1a = function () {
    var current = this.c1d();
    if (current === charSequenceLength(this.z1c())) {
      this.g17('EOF');
    }
    var tmp;
    if (charSequenceGet(this.z1c(), current) === _Char___init__impl__6a9atx(34)) {
      current = current + 1 | 0;
      tmp = true;
    } else {
      tmp = false;
    }
    var hasQuotation = tmp;
    var result = consumeBoolean2(this, current);
    if (hasQuotation) {
      if (this.d13_1 === charSequenceLength(this.z1c())) {
        this.g17('EOF');
      }
      if (!(charSequenceGet(this.z1c(), this.d13_1) === _Char___init__impl__6a9atx(34))) {
        this.g17('Expected closing quotation mark');
      }
      this.d13_1 = this.d13_1 + 1 | 0;
    }
    return result;
  };
  function charToTokenClass(c) {
    var tmp;
    // Inline function 'kotlin.code' call
    if (Char__toInt_impl_vasixd(c) < 126) {
      var tmp_0 = CharMappings_getInstance().k1d_1;
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
    return c < 117 ? CharMappings_getInstance().j1d_1[c] : _Char___init__impl__6a9atx(0);
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
      $this.j1d_1[tmp$ret$0] = numberToChar(c);
    }
  }
  function initC2ESC_0($this, c, esc) {
    // Inline function 'kotlin.code' call
    var tmp$ret$0 = Char__toInt_impl_vasixd(c);
    return initC2ESC($this, tmp$ret$0, esc);
  }
  function initC2TC($this, c, cl) {
    $this.k1d_1[c] = cl;
  }
  function initC2TC_0($this, c, cl) {
    // Inline function 'kotlin.code' call
    var tmp$ret$0 = Char__toInt_impl_vasixd(c);
    return initC2TC($this, tmp$ret$0, cl);
  }
  function CharMappings() {
    CharMappings_instance = this;
    this.j1d_1 = charArray(117);
    this.k1d_1 = new Int8Array(126);
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
  protoOf(StringJsonLexerWithComments).n18 = function () {
    var source = this.z1c();
    var cpos = this.c1d();
    if (cpos >= source.length || cpos === -1)
      return 10;
    this.d13_1 = cpos + 1 | 0;
    return charToTokenClass(charSequenceGet(source, cpos));
  };
  protoOf(StringJsonLexerWithComments).j18 = function () {
    var current = this.c1d();
    if (current >= this.z1c().length || current === -1)
      return false;
    return this.d1d(charSequenceGet(this.z1c(), current));
  };
  protoOf(StringJsonLexerWithComments).y19 = function (expected) {
    var source = this.z1c();
    var current = this.c1d();
    if (current >= source.length || current === -1) {
      this.d13_1 = -1;
      this.f1d(expected);
    }
    var c = charSequenceGet(source, current);
    this.d13_1 = current + 1 | 0;
    if (c === expected)
      return Unit_instance;
    else {
      this.f1d(expected);
    }
  };
  protoOf(StringJsonLexerWithComments).i18 = function () {
    var source = this.z1c();
    var cpos = this.c1d();
    if (cpos >= source.length || cpos === -1)
      return 10;
    this.d13_1 = cpos;
    return charToTokenClass(charSequenceGet(source, cpos));
  };
  protoOf(StringJsonLexerWithComments).c1d = function () {
    var current = this.d13_1;
    if (current === -1)
      return current;
    var source = this.z1c();
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
            this.d13_1 = source.length;
            this.g17('Expected end of the block comment: "*/", but had EOF instead');
          } else {
            current = current + 2 | 0;
          }
          continue $l$loop_1;
        }
      }
      break $l$loop_1;
    }
    this.d13_1 = current;
    return current;
  };
  function StringJsonLexer(source) {
    AbstractJsonLexer.call(this);
    this.u1d_1 = source;
  }
  protoOf(StringJsonLexer).z1c = function () {
    return this.u1d_1;
  };
  protoOf(StringJsonLexer).a1d = function (position) {
    return position < this.z1c().length ? position : -1;
  };
  protoOf(StringJsonLexer).n18 = function () {
    var source = this.z1c();
    var cpos = this.d13_1;
    $l$loop: while (!(cpos === -1) && cpos < source.length) {
      var _unary__edvuaz = cpos;
      cpos = _unary__edvuaz + 1 | 0;
      var c = charSequenceGet(source, _unary__edvuaz);
      // Inline function 'kotlinx.serialization.json.internal.AbstractJsonLexer.isWs' call
      if (c === _Char___init__impl__6a9atx(32) || c === _Char___init__impl__6a9atx(10) || c === _Char___init__impl__6a9atx(13) || c === _Char___init__impl__6a9atx(9))
        continue $l$loop;
      this.d13_1 = cpos;
      return charToTokenClass(c);
    }
    this.d13_1 = source.length;
    return 10;
  };
  protoOf(StringJsonLexer).j18 = function () {
    var current = this.d13_1;
    if (current === -1)
      return false;
    var source = this.z1c();
    $l$loop: while (current < source.length) {
      var c = charSequenceGet(source, current);
      // Inline function 'kotlinx.serialization.json.internal.AbstractJsonLexer.isWs' call
      if (c === _Char___init__impl__6a9atx(32) || c === _Char___init__impl__6a9atx(10) || c === _Char___init__impl__6a9atx(13) || c === _Char___init__impl__6a9atx(9)) {
        current = current + 1 | 0;
        continue $l$loop;
      }
      this.d13_1 = current;
      return this.d1d(c);
    }
    this.d13_1 = current;
    return false;
  };
  protoOf(StringJsonLexer).c1d = function () {
    var current = this.d13_1;
    if (current === -1)
      return current;
    var source = this.z1c();
    $l$loop: while (current < source.length) {
      var c = charSequenceGet(source, current);
      // Inline function 'kotlinx.serialization.json.internal.AbstractJsonLexer.isWs' call
      if (c === _Char___init__impl__6a9atx(32) || c === _Char___init__impl__6a9atx(10) || c === _Char___init__impl__6a9atx(13) || c === _Char___init__impl__6a9atx(9)) {
        current = current + 1 | 0;
      } else {
        break $l$loop;
      }
    }
    this.d13_1 = current;
    return current;
  };
  protoOf(StringJsonLexer).y19 = function (expected) {
    if (this.d13_1 === -1) {
      this.f1d(expected);
    }
    var source = this.z1c();
    var cpos = this.d13_1;
    $l$loop: while (cpos < source.length) {
      var _unary__edvuaz = cpos;
      cpos = _unary__edvuaz + 1 | 0;
      var c = charSequenceGet(source, _unary__edvuaz);
      // Inline function 'kotlinx.serialization.json.internal.AbstractJsonLexer.isWs' call
      if (c === _Char___init__impl__6a9atx(32) || c === _Char___init__impl__6a9atx(10) || c === _Char___init__impl__6a9atx(13) || c === _Char___init__impl__6a9atx(9))
        continue $l$loop;
      this.d13_1 = cpos;
      if (c === expected)
        return Unit_instance;
      this.f1d(expected);
    }
    this.d13_1 = -1;
    this.f1d(expected);
  };
  protoOf(StringJsonLexer).e1a = function () {
    this.y19(_Char___init__impl__6a9atx(34));
    var current = this.d13_1;
    var closingQuote = indexOf_0(this.z1c(), _Char___init__impl__6a9atx(34), current);
    if (closingQuote === -1) {
      this.l18();
      this.g1d(1, false);
    }
    var inductionVariable = current;
    if (inductionVariable < closingQuote)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        if (charSequenceGet(this.z1c(), i) === _Char___init__impl__6a9atx(92)) {
          return this.consumeString2(this.z1c(), this.d13_1, i);
        }
      }
       while (inductionVariable < closingQuote);
    this.d13_1 = closingQuote + 1 | 0;
    // Inline function 'kotlin.text.substring' call
    // Inline function 'kotlin.js.asDynamic' call
    return this.z1c().substring(current, closingQuote);
  };
  protoOf(StringJsonLexer).g1a = function (keyToMatch, isLenient) {
    var positionSnapshot = this.d13_1;
    try {
      if (!(this.n18() === 6))
        return null;
      var firstKey = this.b1a(isLenient);
      if (!(firstKey === keyToMatch))
        return null;
      this.h1d();
      if (!(this.n18() === 5))
        return null;
      return this.b1a(isLenient);
    }finally {
      this.d13_1 = positionSnapshot;
      this.h1d();
    }
  };
  function StringJsonLexer_0(json, source) {
    return !json.o12_1.q14_1 ? new StringJsonLexer(source) : new StringJsonLexerWithComments(source);
  }
  function get_schemaCache(_this__u8e3s4) {
    return _this__u8e3s4.q12_1;
  }
  function JsonToStringWriter() {
    this.t12_1 = StringBuilder_init_$Create$_0(128);
  }
  protoOf(JsonToStringWriter).k16 = function (value) {
    this.t12_1.oa(value);
  };
  protoOf(JsonToStringWriter).e16 = function (char) {
    this.t12_1.g7(char);
  };
  protoOf(JsonToStringWriter).g16 = function (text) {
    this.t12_1.f7(text);
  };
  protoOf(JsonToStringWriter).q16 = function (text) {
    printQuoted(this.t12_1, text);
  };
  protoOf(JsonToStringWriter).u12 = function () {
    this.t12_1.ra();
  };
  protoOf(JsonToStringWriter).toString = function () {
    return this.t12_1.toString();
  };
  function createMapForCache(initialCapacity) {
    return HashMap_init_$Create$(initialCapacity);
  }
  //region block: post-declaration
  protoOf(defer$1).oj = get_isNullable;
  protoOf(defer$1).uj = get_isInline;
  protoOf(defer$1).wj = get_annotations;
  protoOf(PolymorphismValidator).h12 = contextual;
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
  _.$_$.a = Json_0;
  //endregion
  return _;
}(module.exports, require('./kotlinx-serialization-kotlinx-serialization-core.js'), require('./kotlin-kotlin-stdlib.js')));

//# sourceMappingURL=kotlinx-serialization-kotlinx-serialization-json.js.map
