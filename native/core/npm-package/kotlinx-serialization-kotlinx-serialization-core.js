(function (_, kotlin_kotlin) {
  'use strict';
  //region block: imports
  var imul = Math.imul;
  var protoOf = kotlin_kotlin.$_$.t7;
  var initMetadataForInterface = kotlin_kotlin.$_$.z6;
  var VOID = kotlin_kotlin.$_$.f;
  var StringCompanionObject_instance = kotlin_kotlin.$_$.g3;
  var Unit_instance = kotlin_kotlin.$_$.r3;
  var emptyList = kotlin_kotlin.$_$.z4;
  var LazyThreadSafetyMode_PUBLICATION_getInstance = kotlin_kotlin.$_$.h;
  var lazy = kotlin_kotlin.$_$.oa;
  var toString = kotlin_kotlin.$_$.x7;
  var initMetadataForClass = kotlin_kotlin.$_$.w6;
  var getKClassFromExpression = kotlin_kotlin.$_$.d;
  var KProperty1 = kotlin_kotlin.$_$.g8;
  var getPropertyCallableRef = kotlin_kotlin.$_$.t6;
  var IllegalArgumentException_init_$Init$ = kotlin_kotlin.$_$.a1;
  var objectCreate = kotlin_kotlin.$_$.s7;
  var captureStack = kotlin_kotlin.$_$.k6;
  var IllegalArgumentException_init_$Init$_0 = kotlin_kotlin.$_$.b1;
  var IllegalArgumentException_init_$Init$_1 = kotlin_kotlin.$_$.d1;
  var IllegalArgumentException = kotlin_kotlin.$_$.s9;
  var collectionSizeOrDefault = kotlin_kotlin.$_$.k4;
  var ArrayList_init_$Create$ = kotlin_kotlin.$_$.i;
  var THROW_CCE = kotlin_kotlin.$_$.w9;
  var KClass = kotlin_kotlin.$_$.f8;
  var isInterface = kotlin_kotlin.$_$.j7;
  var Triple = kotlin_kotlin.$_$.x9;
  var getKClass = kotlin_kotlin.$_$.e;
  var Pair = kotlin_kotlin.$_$.u9;
  var Entry = kotlin_kotlin.$_$.z3;
  var KtMap = kotlin_kotlin.$_$.a4;
  var KtMutableMap = kotlin_kotlin.$_$.c4;
  var LinkedHashMap = kotlin_kotlin.$_$.w3;
  var HashMap = kotlin_kotlin.$_$.u3;
  var KtSet = kotlin_kotlin.$_$.e4;
  var KtMutableSet = kotlin_kotlin.$_$.d4;
  var LinkedHashSet = kotlin_kotlin.$_$.x3;
  var HashSet = kotlin_kotlin.$_$.v3;
  var Collection = kotlin_kotlin.$_$.t3;
  var KtList = kotlin_kotlin.$_$.y3;
  var KtMutableList = kotlin_kotlin.$_$.b4;
  var ArrayList = kotlin_kotlin.$_$.s3;
  var copyToArray = kotlin_kotlin.$_$.x4;
  var _Result___get_value__impl__bjfvqg = kotlin_kotlin.$_$.p1;
  var _Result___get_isFailure__impl__jpiriv = kotlin_kotlin.$_$.o1;
  var Result = kotlin_kotlin.$_$.v9;
  var ensureNotNull = kotlin_kotlin.$_$.ka;
  var equals = kotlin_kotlin.$_$.r6;
  var getStringHashCode = kotlin_kotlin.$_$.u6;
  var isBlank = kotlin_kotlin.$_$.p8;
  var IllegalArgumentException_init_$Create$ = kotlin_kotlin.$_$.c1;
  var toList = kotlin_kotlin.$_$.z5;
  var ArrayList_init_$Create$_0 = kotlin_kotlin.$_$.j;
  var HashSet_init_$Create$ = kotlin_kotlin.$_$.p;
  var toHashSet = kotlin_kotlin.$_$.x5;
  var toBooleanArray = kotlin_kotlin.$_$.w5;
  var withIndex = kotlin_kotlin.$_$.d6;
  var to = kotlin_kotlin.$_$.ta;
  var toMap = kotlin_kotlin.$_$.a6;
  var lazy_0 = kotlin_kotlin.$_$.pa;
  var contentEquals = kotlin_kotlin.$_$.l4;
  var until = kotlin_kotlin.$_$.e8;
  var joinToString = kotlin_kotlin.$_$.h5;
  var initMetadataForObject = kotlin_kotlin.$_$.b7;
  var Long = kotlin_kotlin.$_$.t9;
  var Char = kotlin_kotlin.$_$.n9;
  var Duration__toIsoString_impl_9h6wsm = kotlin_kotlin.$_$.i1;
  var Duration = kotlin_kotlin.$_$.l9;
  var Companion_getInstance = kotlin_kotlin.$_$.i3;
  var Uuid = kotlin_kotlin.$_$.m9;
  var Companion_getInstance_0 = kotlin_kotlin.$_$.j3;
  var toIntOrNull = kotlin_kotlin.$_$.b9;
  var hashCode = kotlin_kotlin.$_$.v6;
  var IllegalStateException_init_$Create$ = kotlin_kotlin.$_$.e1;
  var ArrayList_init_$Create$_1 = kotlin_kotlin.$_$.k;
  var HashSet_init_$Create$_0 = kotlin_kotlin.$_$.q;
  var LinkedHashSet_init_$Create$ = kotlin_kotlin.$_$.u;
  var LinkedHashSet_init_$Create$_0 = kotlin_kotlin.$_$.v;
  var HashMap_init_$Create$ = kotlin_kotlin.$_$.m;
  var HashMap_init_$Create$_0 = kotlin_kotlin.$_$.n;
  var LinkedHashMap_init_$Create$ = kotlin_kotlin.$_$.s;
  var LinkedHashMap_init_$Create$_0 = kotlin_kotlin.$_$.t;
  var isArray = kotlin_kotlin.$_$.c7;
  var arrayIterator = kotlin_kotlin.$_$.i6;
  var asList = kotlin_kotlin.$_$.g4;
  var step = kotlin_kotlin.$_$.d8;
  var getValue = kotlin_kotlin.$_$.d5;
  var longArray = kotlin_kotlin.$_$.n7;
  var initMetadataForCompanion = kotlin_kotlin.$_$.x6;
  var get_lastIndex = kotlin_kotlin.$_$.i5;
  var countTrailingZeroBits = kotlin_kotlin.$_$.ia;
  var indexOf = kotlin_kotlin.$_$.e5;
  var contentToString = kotlin_kotlin.$_$.n4;
  var Enum = kotlin_kotlin.$_$.r9;
  var HashSet_init_$Create$_1 = kotlin_kotlin.$_$.o;
  var toString_0 = kotlin_kotlin.$_$.sa;
  var KTypeParameter = kotlin_kotlin.$_$.h8;
  var contentHashCode = kotlin_kotlin.$_$.m4;
  var booleanArray = kotlin_kotlin.$_$.j6;
  var emptyMap = kotlin_kotlin.$_$.a5;
  var Companion_getInstance_1 = kotlin_kotlin.$_$.k3;
  var isCharArray = kotlin_kotlin.$_$.f7;
  var charArray = kotlin_kotlin.$_$.m6;
  var DoubleCompanionObject_instance = kotlin_kotlin.$_$.c3;
  var isDoubleArray = kotlin_kotlin.$_$.g7;
  var FloatCompanionObject_instance = kotlin_kotlin.$_$.d3;
  var isFloatArray = kotlin_kotlin.$_$.h7;
  var Companion_getInstance_2 = kotlin_kotlin.$_$.l3;
  var isLongArray = kotlin_kotlin.$_$.k7;
  var Companion_getInstance_3 = kotlin_kotlin.$_$.p3;
  var _ULongArray___get_size__impl__ju6dtr = kotlin_kotlin.$_$.p2;
  var ULongArray = kotlin_kotlin.$_$.ca;
  var _ULongArray___init__impl__twm1l3 = kotlin_kotlin.$_$.l2;
  var _ULong___init__impl__c78o9k = kotlin_kotlin.$_$.i2;
  var ULongArray__get_impl_pr71q9 = kotlin_kotlin.$_$.n2;
  var _ULong___get_data__impl__fggpzb = kotlin_kotlin.$_$.j2;
  var IntCompanionObject_instance = kotlin_kotlin.$_$.e3;
  var isIntArray = kotlin_kotlin.$_$.i7;
  var Companion_getInstance_4 = kotlin_kotlin.$_$.o3;
  var _UIntArray___get_size__impl__r6l8ci = kotlin_kotlin.$_$.g2;
  var UIntArray = kotlin_kotlin.$_$.aa;
  var _UIntArray___init__impl__ghjpc6 = kotlin_kotlin.$_$.c2;
  var _UInt___init__impl__l7qpdl = kotlin_kotlin.$_$.z1;
  var UIntArray__get_impl_gp5kza = kotlin_kotlin.$_$.e2;
  var _UInt___get_data__impl__f0vqqw = kotlin_kotlin.$_$.a2;
  var ShortCompanionObject_instance = kotlin_kotlin.$_$.f3;
  var isShortArray = kotlin_kotlin.$_$.l7;
  var Companion_getInstance_5 = kotlin_kotlin.$_$.q3;
  var _UShortArray___get_size__impl__jqto1b = kotlin_kotlin.$_$.y2;
  var UShortArray = kotlin_kotlin.$_$.ea;
  var _UShortArray___init__impl__9b26ef = kotlin_kotlin.$_$.u2;
  var _UShort___init__impl__jigrne = kotlin_kotlin.$_$.r2;
  var UShortArray__get_impl_fnbhmx = kotlin_kotlin.$_$.w2;
  var _UShort___get_data__impl__g0245 = kotlin_kotlin.$_$.s2;
  var ByteCompanionObject_instance = kotlin_kotlin.$_$.b3;
  var isByteArray = kotlin_kotlin.$_$.e7;
  var Companion_getInstance_6 = kotlin_kotlin.$_$.n3;
  var _UByteArray___get_size__impl__h6pkdv = kotlin_kotlin.$_$.x1;
  var UByteArray = kotlin_kotlin.$_$.y9;
  var _UByteArray___init__impl__ip4y9n = kotlin_kotlin.$_$.u1;
  var _UByte___init__impl__g9hnc4 = kotlin_kotlin.$_$.q1;
  var UByteArray__get_impl_t5f3hv = kotlin_kotlin.$_$.v1;
  var _UByte___get_data__impl__jof9qr = kotlin_kotlin.$_$.r1;
  var BooleanCompanionObject_instance = kotlin_kotlin.$_$.a3;
  var isBooleanArray = kotlin_kotlin.$_$.d7;
  var coerceAtLeast = kotlin_kotlin.$_$.z7;
  var copyOf = kotlin_kotlin.$_$.r4;
  var copyOf_0 = kotlin_kotlin.$_$.t4;
  var copyOf_1 = kotlin_kotlin.$_$.u4;
  var copyOf_2 = kotlin_kotlin.$_$.p4;
  var _ULongArray___get_storage__impl__28e64j = kotlin_kotlin.$_$.q2;
  var _ULongArray___init__impl__twm1l3_0 = kotlin_kotlin.$_$.m2;
  var ULongArray__set_impl_z19mvh = kotlin_kotlin.$_$.o2;
  var copyOf_3 = kotlin_kotlin.$_$.w4;
  var _UIntArray___get_storage__impl__92a0v0 = kotlin_kotlin.$_$.h2;
  var _UIntArray___init__impl__ghjpc6_0 = kotlin_kotlin.$_$.d2;
  var UIntArray__set_impl_7f2zu2 = kotlin_kotlin.$_$.f2;
  var copyOf_4 = kotlin_kotlin.$_$.o4;
  var _UShortArray___get_storage__impl__t2jpv5 = kotlin_kotlin.$_$.z2;
  var _UShortArray___init__impl__9b26ef_0 = kotlin_kotlin.$_$.v2;
  var UShortArray__set_impl_6d8whp = kotlin_kotlin.$_$.x2;
  var copyOf_5 = kotlin_kotlin.$_$.s4;
  var _UByteArray___get_storage__impl__d4kctt = kotlin_kotlin.$_$.y1;
  var _UByteArray___init__impl__ip4y9n_0 = kotlin_kotlin.$_$.t1;
  var UByteArray__set_impl_jvcicn = kotlin_kotlin.$_$.w1;
  var copyOf_6 = kotlin_kotlin.$_$.q4;
  var Unit = kotlin_kotlin.$_$.ga;
  var trimIndent = kotlin_kotlin.$_$.k9;
  var charSequenceLength = kotlin_kotlin.$_$.o6;
  var lastOrNull = kotlin_kotlin.$_$.k5;
  var get_lastIndex_0 = kotlin_kotlin.$_$.j5;
  var ULong = kotlin_kotlin.$_$.da;
  var UInt = kotlin_kotlin.$_$.ba;
  var UShort = kotlin_kotlin.$_$.fa;
  var UByte = kotlin_kotlin.$_$.z9;
  var noWhenBranchMatchedException = kotlin_kotlin.$_$.qa;
  var PrimitiveClasses_getInstance = kotlin_kotlin.$_$.h3;
  var mapOf = kotlin_kotlin.$_$.o5;
  var get_js = kotlin_kotlin.$_$.m7;
  var findAssociatedObject = kotlin_kotlin.$_$.c;
  var get_indices = kotlin_kotlin.$_$.g5;
  var IndexOutOfBoundsException_init_$Create$ = kotlin_kotlin.$_$.f1;
  var get_indices_0 = kotlin_kotlin.$_$.f5;
  var Companion_instance = kotlin_kotlin.$_$.m3;
  var _Result___init__impl__xyqfz8 = kotlin_kotlin.$_$.n1;
  var createFailure = kotlin_kotlin.$_$.ja;
  //endregion
  //region block: pre-declaration
  initMetadataForInterface(SerializationStrategy, 'SerializationStrategy');
  initMetadataForInterface(DeserializationStrategy, 'DeserializationStrategy');
  initMetadataForInterface(KSerializer, 'KSerializer', VOID, VOID, [SerializationStrategy, DeserializationStrategy]);
  initMetadataForClass(AbstractPolymorphicSerializer, 'AbstractPolymorphicSerializer', VOID, VOID, [KSerializer]);
  initMetadataForClass(PolymorphicSerializer, 'PolymorphicSerializer', VOID, AbstractPolymorphicSerializer);
  initMetadataForClass(SealedClassSerializer, 'SealedClassSerializer', VOID, AbstractPolymorphicSerializer);
  initMetadataForClass(SerializationException, 'SerializationException', SerializationException_init_$Create$, IllegalArgumentException);
  initMetadataForClass(UnknownFieldException, 'UnknownFieldException', VOID, SerializationException);
  initMetadataForClass(MissingFieldException, 'MissingFieldException', VOID, SerializationException);
  function get_isNullable() {
    return false;
  }
  function get_isInline() {
    return false;
  }
  function get_annotations() {
    return emptyList();
  }
  initMetadataForInterface(SerialDescriptor, 'SerialDescriptor');
  initMetadataForClass(ContextDescriptor, 'ContextDescriptor', VOID, VOID, [SerialDescriptor]);
  initMetadataForClass(elementDescriptors$1);
  initMetadataForClass(elementDescriptors$$inlined$Iterable$1);
  initMetadataForClass(elementNames$1);
  initMetadataForClass(elementNames$$inlined$Iterable$1);
  initMetadataForClass(ClassSerialDescriptorBuilder, 'ClassSerialDescriptorBuilder');
  initMetadataForInterface(CachedNames, 'CachedNames');
  initMetadataForClass(SerialDescriptorImpl, 'SerialDescriptorImpl', VOID, VOID, [SerialDescriptor, CachedNames]);
  initMetadataForClass(SerialKind, 'SerialKind');
  initMetadataForObject(ENUM, 'ENUM', VOID, SerialKind);
  initMetadataForObject(CONTEXTUAL, 'CONTEXTUAL', VOID, SerialKind);
  initMetadataForClass(PolymorphicKind, 'PolymorphicKind', VOID, SerialKind);
  initMetadataForObject(SEALED, 'SEALED', VOID, PolymorphicKind);
  initMetadataForObject(OPEN, 'OPEN', VOID, PolymorphicKind);
  initMetadataForClass(PrimitiveKind, 'PrimitiveKind', VOID, SerialKind);
  initMetadataForObject(BOOLEAN, 'BOOLEAN', VOID, PrimitiveKind);
  initMetadataForObject(BYTE, 'BYTE', VOID, PrimitiveKind);
  initMetadataForObject(CHAR, 'CHAR', VOID, PrimitiveKind);
  initMetadataForObject(SHORT, 'SHORT', VOID, PrimitiveKind);
  initMetadataForObject(INT, 'INT', VOID, PrimitiveKind);
  initMetadataForObject(LONG, 'LONG', VOID, PrimitiveKind);
  initMetadataForObject(FLOAT, 'FLOAT', VOID, PrimitiveKind);
  initMetadataForObject(DOUBLE, 'DOUBLE', VOID, PrimitiveKind);
  initMetadataForObject(STRING, 'STRING', VOID, PrimitiveKind);
  initMetadataForClass(StructureKind, 'StructureKind', VOID, SerialKind);
  initMetadataForObject(CLASS, 'CLASS', VOID, StructureKind);
  initMetadataForObject(LIST, 'LIST', VOID, StructureKind);
  initMetadataForObject(MAP, 'MAP', VOID, StructureKind);
  initMetadataForObject(OBJECT, 'OBJECT', VOID, StructureKind);
  function decodeSerializableValue(deserializer) {
    return deserializer.qi(this);
  }
  initMetadataForInterface(Decoder, 'Decoder');
  function decodeSequentially() {
    return false;
  }
  function decodeCollectionSize(descriptor) {
    return -1;
  }
  function decodeSerializableElement$default(descriptor, index, deserializer, previousValue, $super) {
    previousValue = previousValue === VOID ? null : previousValue;
    return $super === VOID ? this.bm(descriptor, index, deserializer, previousValue) : $super.bm.call(this, descriptor, index, deserializer, previousValue);
  }
  initMetadataForInterface(CompositeDecoder, 'CompositeDecoder');
  initMetadataForClass(AbstractDecoder, 'AbstractDecoder', VOID, VOID, [Decoder, CompositeDecoder]);
  function encodeNotNullMark() {
  }
  function beginCollection(descriptor, collectionSize) {
    return this.pl(descriptor);
  }
  function encodeSerializableValue(serializer, value) {
    serializer.pi(this, value);
  }
  function encodeNullableSerializableValue(serializer, value) {
    var isNullabilitySupported = serializer.oi().oj();
    if (isNullabilitySupported) {
      return this.hn(isInterface(serializer, SerializationStrategy) ? serializer : THROW_CCE(), value);
    }
    if (value == null) {
      this.km();
    } else {
      this.kn();
      this.hn(serializer, value);
    }
  }
  initMetadataForInterface(Encoder, 'Encoder');
  function shouldEncodeElementDefault(descriptor, index) {
    return true;
  }
  initMetadataForInterface(CompositeEncoder, 'CompositeEncoder');
  initMetadataForClass(AbstractEncoder, 'AbstractEncoder', VOID, VOID, [Encoder, CompositeEncoder]);
  initMetadataForObject(NothingSerializer_0, 'NothingSerializer', VOID, VOID, [KSerializer]);
  initMetadataForObject(DurationSerializer, 'DurationSerializer', VOID, VOID, [KSerializer]);
  initMetadataForObject(UuidSerializer, 'UuidSerializer', VOID, VOID, [KSerializer]);
  initMetadataForClass(ListLikeDescriptor, 'ListLikeDescriptor', VOID, VOID, [SerialDescriptor]);
  initMetadataForClass(ArrayListClassDesc, 'ArrayListClassDesc', VOID, ListLikeDescriptor);
  initMetadataForClass(HashSetClassDesc, 'HashSetClassDesc', VOID, ListLikeDescriptor);
  initMetadataForClass(LinkedHashSetClassDesc, 'LinkedHashSetClassDesc', VOID, ListLikeDescriptor);
  initMetadataForClass(MapLikeDescriptor, 'MapLikeDescriptor', VOID, VOID, [SerialDescriptor]);
  initMetadataForClass(HashMapClassDesc, 'HashMapClassDesc', VOID, MapLikeDescriptor);
  initMetadataForClass(LinkedHashMapClassDesc, 'LinkedHashMapClassDesc', VOID, MapLikeDescriptor);
  initMetadataForClass(ArrayClassDesc, 'ArrayClassDesc', VOID, ListLikeDescriptor);
  initMetadataForClass(PrimitiveArrayDescriptor, 'PrimitiveArrayDescriptor', VOID, ListLikeDescriptor);
  initMetadataForClass(AbstractCollectionSerializer, 'AbstractCollectionSerializer', VOID, VOID, [KSerializer]);
  initMetadataForClass(CollectionLikeSerializer, 'CollectionLikeSerializer', VOID, AbstractCollectionSerializer);
  initMetadataForClass(CollectionSerializer, 'CollectionSerializer', VOID, CollectionLikeSerializer);
  initMetadataForClass(ArrayListSerializer, 'ArrayListSerializer', VOID, CollectionSerializer);
  initMetadataForClass(HashSetSerializer, 'HashSetSerializer', VOID, CollectionSerializer);
  initMetadataForClass(LinkedHashSetSerializer, 'LinkedHashSetSerializer', VOID, CollectionSerializer);
  initMetadataForClass(MapLikeSerializer, 'MapLikeSerializer', VOID, AbstractCollectionSerializer);
  initMetadataForClass(HashMapSerializer, 'HashMapSerializer', VOID, MapLikeSerializer);
  initMetadataForClass(LinkedHashMapSerializer, 'LinkedHashMapSerializer', VOID, MapLikeSerializer);
  initMetadataForClass(ReferenceArraySerializer, 'ReferenceArraySerializer', VOID, CollectionLikeSerializer);
  initMetadataForClass(PrimitiveArraySerializer, 'PrimitiveArraySerializer', VOID, CollectionLikeSerializer);
  initMetadataForClass(PrimitiveArrayBuilder, 'PrimitiveArrayBuilder');
  initMetadataForCompanion(Companion);
  initMetadataForClass(ElementMarker, 'ElementMarker');
  initMetadataForClass(EnumSerializer, 'EnumSerializer', VOID, VOID, [KSerializer]);
  initMetadataForClass(PluginGeneratedSerialDescriptor, 'PluginGeneratedSerialDescriptor', VOID, VOID, [SerialDescriptor, CachedNames]);
  initMetadataForClass(EnumDescriptor, 'EnumDescriptor', VOID, PluginGeneratedSerialDescriptor);
  initMetadataForClass(InlineClassDescriptor, 'InlineClassDescriptor', VOID, PluginGeneratedSerialDescriptor);
  function typeParametersSerializers() {
    return get_EMPTY_SERIALIZER_ARRAY();
  }
  initMetadataForInterface(GeneratedSerializer, 'GeneratedSerializer', VOID, VOID, [KSerializer]);
  initMetadataForClass(InlinePrimitiveDescriptor$1, VOID, VOID, VOID, [GeneratedSerializer]);
  initMetadataForObject(NoOpEncoder, 'NoOpEncoder', VOID, AbstractEncoder);
  initMetadataForObject(NothingSerialDescriptor, 'NothingSerialDescriptor', VOID, VOID, [SerialDescriptor]);
  initMetadataForClass(NullableSerializer, 'NullableSerializer', VOID, VOID, [KSerializer]);
  initMetadataForClass(SerialDescriptorForNullable, 'SerialDescriptorForNullable', VOID, VOID, [SerialDescriptor, CachedNames]);
  initMetadataForClass(ObjectSerializer, 'ObjectSerializer', VOID, VOID, [KSerializer]);
  initMetadataForInterface(SerializerFactory, 'SerializerFactory');
  initMetadataForObject(CharArraySerializer_0, 'CharArraySerializer', VOID, PrimitiveArraySerializer, [KSerializer, PrimitiveArraySerializer]);
  initMetadataForObject(DoubleArraySerializer_0, 'DoubleArraySerializer', VOID, PrimitiveArraySerializer, [KSerializer, PrimitiveArraySerializer]);
  initMetadataForObject(FloatArraySerializer_0, 'FloatArraySerializer', VOID, PrimitiveArraySerializer, [KSerializer, PrimitiveArraySerializer]);
  initMetadataForObject(LongArraySerializer_0, 'LongArraySerializer', VOID, PrimitiveArraySerializer, [KSerializer, PrimitiveArraySerializer]);
  initMetadataForObject(ULongArraySerializer_0, 'ULongArraySerializer', VOID, PrimitiveArraySerializer, [KSerializer, PrimitiveArraySerializer]);
  initMetadataForObject(IntArraySerializer_0, 'IntArraySerializer', VOID, PrimitiveArraySerializer, [KSerializer, PrimitiveArraySerializer]);
  initMetadataForObject(UIntArraySerializer_0, 'UIntArraySerializer', VOID, PrimitiveArraySerializer, [KSerializer, PrimitiveArraySerializer]);
  initMetadataForObject(ShortArraySerializer_0, 'ShortArraySerializer', VOID, PrimitiveArraySerializer, [KSerializer, PrimitiveArraySerializer]);
  initMetadataForObject(UShortArraySerializer_0, 'UShortArraySerializer', VOID, PrimitiveArraySerializer, [KSerializer, PrimitiveArraySerializer]);
  initMetadataForObject(ByteArraySerializer_0, 'ByteArraySerializer', VOID, PrimitiveArraySerializer, [KSerializer, PrimitiveArraySerializer]);
  initMetadataForObject(UByteArraySerializer_0, 'UByteArraySerializer', VOID, PrimitiveArraySerializer, [KSerializer, PrimitiveArraySerializer]);
  initMetadataForObject(BooleanArraySerializer_0, 'BooleanArraySerializer', VOID, PrimitiveArraySerializer, [KSerializer, PrimitiveArraySerializer]);
  initMetadataForClass(CharArrayBuilder, 'CharArrayBuilder', VOID, PrimitiveArrayBuilder);
  initMetadataForClass(DoubleArrayBuilder, 'DoubleArrayBuilder', VOID, PrimitiveArrayBuilder);
  initMetadataForClass(FloatArrayBuilder, 'FloatArrayBuilder', VOID, PrimitiveArrayBuilder);
  initMetadataForClass(LongArrayBuilder, 'LongArrayBuilder', VOID, PrimitiveArrayBuilder);
  initMetadataForClass(ULongArrayBuilder, 'ULongArrayBuilder', VOID, PrimitiveArrayBuilder);
  initMetadataForClass(IntArrayBuilder, 'IntArrayBuilder', VOID, PrimitiveArrayBuilder);
  initMetadataForClass(UIntArrayBuilder, 'UIntArrayBuilder', VOID, PrimitiveArrayBuilder);
  initMetadataForClass(ShortArrayBuilder, 'ShortArrayBuilder', VOID, PrimitiveArrayBuilder);
  initMetadataForClass(UShortArrayBuilder, 'UShortArrayBuilder', VOID, PrimitiveArrayBuilder);
  initMetadataForClass(ByteArrayBuilder, 'ByteArrayBuilder', VOID, PrimitiveArrayBuilder);
  initMetadataForClass(UByteArrayBuilder, 'UByteArrayBuilder', VOID, PrimitiveArrayBuilder);
  initMetadataForClass(BooleanArrayBuilder, 'BooleanArrayBuilder', VOID, PrimitiveArrayBuilder);
  initMetadataForObject(StringSerializer, 'StringSerializer', VOID, VOID, [KSerializer]);
  initMetadataForObject(CharSerializer, 'CharSerializer', VOID, VOID, [KSerializer]);
  initMetadataForObject(DoubleSerializer, 'DoubleSerializer', VOID, VOID, [KSerializer]);
  initMetadataForObject(FloatSerializer, 'FloatSerializer', VOID, VOID, [KSerializer]);
  initMetadataForObject(LongSerializer, 'LongSerializer', VOID, VOID, [KSerializer]);
  initMetadataForObject(IntSerializer, 'IntSerializer', VOID, VOID, [KSerializer]);
  initMetadataForObject(ShortSerializer, 'ShortSerializer', VOID, VOID, [KSerializer]);
  initMetadataForObject(ByteSerializer, 'ByteSerializer', VOID, VOID, [KSerializer]);
  initMetadataForObject(BooleanSerializer, 'BooleanSerializer', VOID, VOID, [KSerializer]);
  initMetadataForObject(UnitSerializer, 'UnitSerializer', VOID, VOID, [KSerializer]);
  initMetadataForClass(PrimitiveSerialDescriptor_0, 'PrimitiveSerialDescriptor', VOID, VOID, [SerialDescriptor]);
  initMetadataForClass(TaggedDecoder, 'TaggedDecoder', VOID, VOID, [Decoder, CompositeDecoder]);
  initMetadataForClass(NamedValueDecoder, 'NamedValueDecoder', VOID, TaggedDecoder);
  initMetadataForClass(MapEntry, 'MapEntry', VOID, VOID, [Entry]);
  initMetadataForClass(KeyValueSerializer, 'KeyValueSerializer', VOID, VOID, [KSerializer]);
  initMetadataForClass(MapEntrySerializer_0, 'MapEntrySerializer', VOID, KeyValueSerializer);
  initMetadataForClass(PairSerializer_0, 'PairSerializer', VOID, KeyValueSerializer);
  initMetadataForClass(TripleSerializer_0, 'TripleSerializer', VOID, VOID, [KSerializer]);
  initMetadataForObject(ULongSerializer, 'ULongSerializer', VOID, VOID, [KSerializer]);
  initMetadataForObject(UIntSerializer, 'UIntSerializer', VOID, VOID, [KSerializer]);
  initMetadataForObject(UShortSerializer, 'UShortSerializer', VOID, VOID, [KSerializer]);
  initMetadataForObject(UByteSerializer, 'UByteSerializer', VOID, VOID, [KSerializer]);
  initMetadataForClass(SerializersModule, 'SerializersModule');
  initMetadataForClass(SerialModuleImpl, 'SerialModuleImpl', VOID, SerializersModule);
  initMetadataForClass(ContextualProvider, 'ContextualProvider');
  initMetadataForClass(Argless, 'Argless', VOID, ContextualProvider);
  initMetadataForClass(WithTypeArguments, 'WithTypeArguments', VOID, ContextualProvider);
  function contextual(kClass, serializer) {
    return this.f12(kClass, SerializersModuleCollector$contextual$lambda(serializer));
  }
  initMetadataForInterface(SerializersModuleCollector, 'SerializersModuleCollector');
  initMetadataForClass(SerializableWith, 'SerializableWith', VOID, VOID, VOID, VOID, 0);
  initMetadataForClass(createCache$1);
  initMetadataForClass(createParametrizedCache$1);
  //endregion
  function KSerializer() {
  }
  function SerializationStrategy() {
  }
  function DeserializationStrategy() {
  }
  function PolymorphicSerializer$descriptor$delegate$lambda$lambda(this$0) {
    return function ($this$buildSerialDescriptor) {
      $this$buildSerialDescriptor.zi('type', serializer_0(StringCompanionObject_instance).oi());
      $this$buildSerialDescriptor.zi('value', buildSerialDescriptor('kotlinx.serialization.Polymorphic<' + this$0.aj_1.z8() + '>', CONTEXTUAL_getInstance(), []));
      $this$buildSerialDescriptor.ti_1 = this$0.bj_1;
      return Unit_instance;
    };
  }
  function PolymorphicSerializer$descriptor$delegate$lambda(this$0) {
    return function () {
      var tmp = OPEN_getInstance();
      return withContext(buildSerialDescriptor('kotlinx.serialization.Polymorphic', tmp, [], PolymorphicSerializer$descriptor$delegate$lambda$lambda(this$0)), this$0.aj_1);
    };
  }
  function PolymorphicSerializer(baseClass) {
    AbstractPolymorphicSerializer.call(this);
    this.aj_1 = baseClass;
    this.bj_1 = emptyList();
    var tmp = this;
    var tmp_0 = LazyThreadSafetyMode_PUBLICATION_getInstance();
    tmp.cj_1 = lazy(tmp_0, PolymorphicSerializer$descriptor$delegate$lambda(this));
  }
  protoOf(PolymorphicSerializer).dj = function () {
    return this.aj_1;
  };
  protoOf(PolymorphicSerializer).oi = function () {
    var tmp0 = this.cj_1;
    // Inline function 'kotlin.getValue' call
    descriptor$factory();
    return tmp0.s1();
  };
  protoOf(PolymorphicSerializer).toString = function () {
    return 'kotlinx.serialization.PolymorphicSerializer(baseClass: ' + toString(this.aj_1) + ')';
  };
  function findPolymorphicSerializer(_this__u8e3s4, encoder, value) {
    var tmp0_elvis_lhs = _this__u8e3s4.gj(encoder, value);
    var tmp;
    if (tmp0_elvis_lhs == null) {
      throwSubtypeNotRegistered(getKClassFromExpression(value), _this__u8e3s4.dj());
    } else {
      tmp = tmp0_elvis_lhs;
    }
    return tmp;
  }
  function findPolymorphicSerializer_0(_this__u8e3s4, decoder, klassName) {
    var tmp0_elvis_lhs = _this__u8e3s4.fj(decoder, klassName);
    var tmp;
    if (tmp0_elvis_lhs == null) {
      throwSubtypeNotRegistered_0(klassName, _this__u8e3s4.dj());
    } else {
      tmp = tmp0_elvis_lhs;
    }
    return tmp;
  }
  function descriptor$factory() {
    return getPropertyCallableRef('descriptor', 1, KProperty1, function (receiver) {
      return receiver.oi();
    }, null);
  }
  function SealedClassSerializer() {
  }
  protoOf(SealedClassSerializer).oi = function () {
    var tmp0 = this.hj_1;
    // Inline function 'kotlin.getValue' call
    descriptor$factory_0();
    return tmp0.s1();
  };
  function descriptor$factory_0() {
    return getPropertyCallableRef('descriptor', 1, KProperty1, function (receiver) {
      return receiver.oi();
    }, null);
  }
  function SerializationException_init_$Init$($this) {
    IllegalArgumentException_init_$Init$($this);
    SerializationException.call($this);
    return $this;
  }
  function SerializationException_init_$Create$() {
    var tmp = SerializationException_init_$Init$(objectCreate(protoOf(SerializationException)));
    captureStack(tmp, SerializationException_init_$Create$);
    return tmp;
  }
  function SerializationException_init_$Init$_0(message, $this) {
    IllegalArgumentException_init_$Init$_0(message, $this);
    SerializationException.call($this);
    return $this;
  }
  function SerializationException_init_$Create$_0(message) {
    var tmp = SerializationException_init_$Init$_0(message, objectCreate(protoOf(SerializationException)));
    captureStack(tmp, SerializationException_init_$Create$_0);
    return tmp;
  }
  function SerializationException_init_$Init$_1(message, cause, $this) {
    IllegalArgumentException_init_$Init$_1(message, cause, $this);
    SerializationException.call($this);
    return $this;
  }
  function SerializationException() {
    captureStack(this, SerializationException);
  }
  function UnknownFieldException_init_$Init$(index, $this) {
    UnknownFieldException.call($this, 'An unknown field for index ' + index);
    return $this;
  }
  function UnknownFieldException_init_$Create$(index) {
    var tmp = UnknownFieldException_init_$Init$(index, objectCreate(protoOf(UnknownFieldException)));
    captureStack(tmp, UnknownFieldException_init_$Create$);
    return tmp;
  }
  function UnknownFieldException(message) {
    SerializationException_init_$Init$_0(message, this);
    captureStack(this, UnknownFieldException);
  }
  function MissingFieldException_init_$Init$(missingFields, serialName, $this) {
    MissingFieldException.call($this, missingFields, missingFields.j() === 1 ? "Field '" + missingFields.k(0) + "' is required for type with serial name '" + serialName + "', but it was missing" : 'Fields ' + toString(missingFields) + " are required for type with serial name '" + serialName + "', but they were missing", null);
    return $this;
  }
  function MissingFieldException_init_$Create$(missingFields, serialName) {
    var tmp = MissingFieldException_init_$Init$(missingFields, serialName, objectCreate(protoOf(MissingFieldException)));
    captureStack(tmp, MissingFieldException_init_$Create$);
    return tmp;
  }
  function MissingFieldException(missingFields, message, cause) {
    SerializationException_init_$Init$_1(message, cause, this);
    captureStack(this, MissingFieldException);
    this.ij_1 = missingFields;
  }
  function serializerOrNull(_this__u8e3s4) {
    var tmp0_elvis_lhs = compiledSerializerImpl(_this__u8e3s4);
    return tmp0_elvis_lhs == null ? builtinSerializerOrNull(_this__u8e3s4) : tmp0_elvis_lhs;
  }
  function serializersForParameters(_this__u8e3s4, typeArguments, failOnMissingTypeArgSerializer) {
    var tmp;
    if (failOnMissingTypeArgSerializer) {
      // Inline function 'kotlin.collections.map' call
      // Inline function 'kotlin.collections.mapTo' call
      var destination = ArrayList_init_$Create$(collectionSizeOrDefault(typeArguments, 10));
      var _iterator__ex2g4s = typeArguments.g();
      while (_iterator__ex2g4s.h()) {
        var item = _iterator__ex2g4s.i();
        var tmp$ret$0 = serializer(_this__u8e3s4, item);
        destination.e(tmp$ret$0);
      }
      tmp = destination;
    } else {
      // Inline function 'kotlin.collections.map' call
      // Inline function 'kotlin.collections.mapTo' call
      var destination_0 = ArrayList_init_$Create$(collectionSizeOrDefault(typeArguments, 10));
      var _iterator__ex2g4s_0 = typeArguments.g();
      while (_iterator__ex2g4s_0.h()) {
        var item_0 = _iterator__ex2g4s_0.i();
        var tmp0_elvis_lhs = serializerOrNull_0(_this__u8e3s4, item_0);
        var tmp_0;
        if (tmp0_elvis_lhs == null) {
          return null;
        } else {
          tmp_0 = tmp0_elvis_lhs;
        }
        var tmp$ret$3 = tmp_0;
        destination_0.e(tmp$ret$3);
      }
      tmp = destination_0;
    }
    var serializers = tmp;
    return serializers;
  }
  function parametrizedSerializerOrNull(_this__u8e3s4, serializers, elementClassifierIfArray) {
    var tmp0_elvis_lhs = builtinParametrizedSerializer(_this__u8e3s4, serializers, elementClassifierIfArray);
    return tmp0_elvis_lhs == null ? compiledParametrizedSerializer(_this__u8e3s4, serializers) : tmp0_elvis_lhs;
  }
  function serializer(_this__u8e3s4, type) {
    var tmp0_elvis_lhs = serializerByKTypeImpl(_this__u8e3s4, type, true);
    var tmp;
    if (tmp0_elvis_lhs == null) {
      platformSpecificSerializerNotRegistered(kclass(type));
    } else {
      tmp = tmp0_elvis_lhs;
    }
    return tmp;
  }
  function serializerOrNull_0(_this__u8e3s4, type) {
    return serializerByKTypeImpl(_this__u8e3s4, type, false);
  }
  function builtinParametrizedSerializer(_this__u8e3s4, serializers, elementClassifierIfArray) {
    var tmp;
    if (_this__u8e3s4.equals(getKClass(Collection)) || _this__u8e3s4.equals(getKClass(KtList)) || (_this__u8e3s4.equals(getKClass(KtMutableList)) || _this__u8e3s4.equals(getKClass(ArrayList)))) {
      tmp = new ArrayListSerializer(serializers.k(0));
    } else if (_this__u8e3s4.equals(getKClass(HashSet))) {
      tmp = new HashSetSerializer(serializers.k(0));
    } else if (_this__u8e3s4.equals(getKClass(KtSet)) || (_this__u8e3s4.equals(getKClass(KtMutableSet)) || _this__u8e3s4.equals(getKClass(LinkedHashSet)))) {
      tmp = new LinkedHashSetSerializer(serializers.k(0));
    } else if (_this__u8e3s4.equals(getKClass(HashMap))) {
      tmp = new HashMapSerializer(serializers.k(0), serializers.k(1));
    } else if (_this__u8e3s4.equals(getKClass(KtMap)) || (_this__u8e3s4.equals(getKClass(KtMutableMap)) || _this__u8e3s4.equals(getKClass(LinkedHashMap)))) {
      tmp = new LinkedHashMapSerializer(serializers.k(0), serializers.k(1));
    } else if (_this__u8e3s4.equals(getKClass(Entry))) {
      tmp = MapEntrySerializer(serializers.k(0), serializers.k(1));
    } else if (_this__u8e3s4.equals(getKClass(Pair))) {
      tmp = PairSerializer(serializers.k(0), serializers.k(1));
    } else if (_this__u8e3s4.equals(getKClass(Triple))) {
      tmp = TripleSerializer(serializers.k(0), serializers.k(1), serializers.k(2));
    } else {
      var tmp_0;
      if (isReferenceArray(_this__u8e3s4)) {
        var tmp_1 = elementClassifierIfArray();
        tmp_0 = ArraySerializer((!(tmp_1 == null) ? isInterface(tmp_1, KClass) : false) ? tmp_1 : THROW_CCE(), serializers.k(0));
      } else {
        tmp_0 = null;
      }
      tmp = tmp_0;
    }
    return tmp;
  }
  function compiledParametrizedSerializer(_this__u8e3s4, serializers) {
    // Inline function 'kotlin.collections.toTypedArray' call
    var tmp$ret$0 = copyToArray(serializers);
    return constructSerializerForGivenTypeArgs(_this__u8e3s4, tmp$ret$0.slice());
  }
  function serializerByKTypeImpl(_this__u8e3s4, type, failOnMissingTypeArgSerializer) {
    var rootClass = kclass(type);
    var isNullable = type.p9();
    // Inline function 'kotlin.collections.map' call
    var this_0 = type.o9();
    // Inline function 'kotlin.collections.mapTo' call
    var destination = ArrayList_init_$Create$(collectionSizeOrDefault(this_0, 10));
    var _iterator__ex2g4s = this_0.g();
    while (_iterator__ex2g4s.h()) {
      var item = _iterator__ex2g4s.i();
      var tmp$ret$0 = typeOrThrow(item);
      destination.e(tmp$ret$0);
    }
    var typeArguments = destination;
    var tmp;
    if (typeArguments.p()) {
      var tmp_0;
      if (isInterface_0(rootClass) && !(_this__u8e3s4.kj(rootClass) == null)) {
        tmp_0 = null;
      } else {
        tmp_0 = findCachedSerializer(rootClass, isNullable);
      }
      tmp = tmp_0;
    } else {
      var tmp_1;
      if (_this__u8e3s4.jj()) {
        tmp_1 = null;
      } else {
        // Inline function 'kotlin.Result.getOrNull' call
        var this_1 = findParametrizedCachedSerializer(rootClass, typeArguments, isNullable);
        var tmp_2;
        if (_Result___get_isFailure__impl__jpiriv(this_1)) {
          tmp_2 = null;
        } else {
          var tmp_3 = _Result___get_value__impl__bjfvqg(this_1);
          tmp_2 = (tmp_3 == null ? true : !(tmp_3 == null)) ? tmp_3 : THROW_CCE();
        }
        tmp_1 = tmp_2;
      }
      tmp = tmp_1;
    }
    var cachedSerializer = tmp;
    if (!(cachedSerializer == null))
      return cachedSerializer;
    var tmp_4;
    if (typeArguments.p()) {
      var tmp0_elvis_lhs = serializerOrNull(rootClass);
      var tmp1_elvis_lhs = tmp0_elvis_lhs == null ? _this__u8e3s4.kj(rootClass) : tmp0_elvis_lhs;
      var tmp_5;
      if (tmp1_elvis_lhs == null) {
        // Inline function 'kotlinx.serialization.polymorphicIfInterface' call
        tmp_5 = isInterface_0(rootClass) ? new PolymorphicSerializer(rootClass) : null;
      } else {
        tmp_5 = tmp1_elvis_lhs;
      }
      tmp_4 = tmp_5;
    } else {
      var tmp2_elvis_lhs = serializersForParameters(_this__u8e3s4, typeArguments, failOnMissingTypeArgSerializer);
      var tmp_6;
      if (tmp2_elvis_lhs == null) {
        return null;
      } else {
        tmp_6 = tmp2_elvis_lhs;
      }
      var serializers = tmp_6;
      var tmp3_elvis_lhs = parametrizedSerializerOrNull(rootClass, serializers, serializerByKTypeImpl$lambda(typeArguments));
      var tmp4_elvis_lhs = tmp3_elvis_lhs == null ? _this__u8e3s4.lj(rootClass, serializers) : tmp3_elvis_lhs;
      var tmp_7;
      if (tmp4_elvis_lhs == null) {
        // Inline function 'kotlinx.serialization.polymorphicIfInterface' call
        tmp_7 = isInterface_0(rootClass) ? new PolymorphicSerializer(rootClass) : null;
      } else {
        tmp_7 = tmp4_elvis_lhs;
      }
      tmp_4 = tmp_7;
    }
    var contextualSerializer = tmp_4;
    var tmp_8;
    if (contextualSerializer == null) {
      tmp_8 = null;
    } else {
      // Inline function 'kotlinx.serialization.internal.cast' call
      tmp_8 = isInterface(contextualSerializer, KSerializer) ? contextualSerializer : THROW_CCE();
    }
    var tmp6_safe_receiver = tmp_8;
    return tmp6_safe_receiver == null ? null : nullable(tmp6_safe_receiver, isNullable);
  }
  function nullable(_this__u8e3s4, shouldBeNullable) {
    if (shouldBeNullable)
      return get_nullable(_this__u8e3s4);
    return isInterface(_this__u8e3s4, KSerializer) ? _this__u8e3s4 : THROW_CCE();
  }
  function serializerByKTypeImpl$lambda($typeArguments) {
    return function () {
      return $typeArguments.k(0).n9();
    };
  }
  function get_SERIALIZERS_CACHE() {
    _init_properties_SerializersCache_kt__hgwi2p();
    return SERIALIZERS_CACHE;
  }
  var SERIALIZERS_CACHE;
  function get_SERIALIZERS_CACHE_NULLABLE() {
    _init_properties_SerializersCache_kt__hgwi2p();
    return SERIALIZERS_CACHE_NULLABLE;
  }
  var SERIALIZERS_CACHE_NULLABLE;
  function get_PARAMETRIZED_SERIALIZERS_CACHE() {
    _init_properties_SerializersCache_kt__hgwi2p();
    return PARAMETRIZED_SERIALIZERS_CACHE;
  }
  var PARAMETRIZED_SERIALIZERS_CACHE;
  function get_PARAMETRIZED_SERIALIZERS_CACHE_NULLABLE() {
    _init_properties_SerializersCache_kt__hgwi2p();
    return PARAMETRIZED_SERIALIZERS_CACHE_NULLABLE;
  }
  var PARAMETRIZED_SERIALIZERS_CACHE_NULLABLE;
  function findCachedSerializer(clazz, isNullable) {
    _init_properties_SerializersCache_kt__hgwi2p();
    var tmp;
    if (!isNullable) {
      var tmp0_safe_receiver = get_SERIALIZERS_CACHE().mj(clazz);
      var tmp_0;
      if (tmp0_safe_receiver == null) {
        tmp_0 = null;
      } else {
        // Inline function 'kotlinx.serialization.internal.cast' call
        tmp_0 = isInterface(tmp0_safe_receiver, KSerializer) ? tmp0_safe_receiver : THROW_CCE();
      }
      tmp = tmp_0;
    } else {
      tmp = get_SERIALIZERS_CACHE_NULLABLE().mj(clazz);
    }
    return tmp;
  }
  function findParametrizedCachedSerializer(clazz, types, isNullable) {
    _init_properties_SerializersCache_kt__hgwi2p();
    var tmp;
    if (!isNullable) {
      var tmp_0 = get_PARAMETRIZED_SERIALIZERS_CACHE().nj(clazz, types);
      tmp = new Result(tmp_0) instanceof Result ? tmp_0 : THROW_CCE();
    } else {
      tmp = get_PARAMETRIZED_SERIALIZERS_CACHE_NULLABLE().nj(clazz, types);
    }
    return tmp;
  }
  function SERIALIZERS_CACHE$lambda(it) {
    _init_properties_SerializersCache_kt__hgwi2p();
    var tmp0_elvis_lhs = serializerOrNull(it);
    var tmp;
    if (tmp0_elvis_lhs == null) {
      // Inline function 'kotlinx.serialization.polymorphicIfInterface' call
      tmp = isInterface_0(it) ? new PolymorphicSerializer(it) : null;
    } else {
      tmp = tmp0_elvis_lhs;
    }
    return tmp;
  }
  function SERIALIZERS_CACHE_NULLABLE$lambda(it) {
    _init_properties_SerializersCache_kt__hgwi2p();
    var tmp0_elvis_lhs = serializerOrNull(it);
    var tmp;
    if (tmp0_elvis_lhs == null) {
      // Inline function 'kotlinx.serialization.polymorphicIfInterface' call
      tmp = isInterface_0(it) ? new PolymorphicSerializer(it) : null;
    } else {
      tmp = tmp0_elvis_lhs;
    }
    var tmp1_safe_receiver = tmp;
    var tmp2_safe_receiver = tmp1_safe_receiver == null ? null : get_nullable(tmp1_safe_receiver);
    var tmp_0;
    if (tmp2_safe_receiver == null) {
      tmp_0 = null;
    } else {
      // Inline function 'kotlinx.serialization.internal.cast' call
      tmp_0 = isInterface(tmp2_safe_receiver, KSerializer) ? tmp2_safe_receiver : THROW_CCE();
    }
    return tmp_0;
  }
  function PARAMETRIZED_SERIALIZERS_CACHE$lambda(clazz, types) {
    _init_properties_SerializersCache_kt__hgwi2p();
    var serializers = ensureNotNull(serializersForParameters(EmptySerializersModule_0(), types, true));
    return parametrizedSerializerOrNull(clazz, serializers, PARAMETRIZED_SERIALIZERS_CACHE$lambda$lambda(types));
  }
  function PARAMETRIZED_SERIALIZERS_CACHE$lambda$lambda($types) {
    return function () {
      return $types.k(0).n9();
    };
  }
  function PARAMETRIZED_SERIALIZERS_CACHE_NULLABLE$lambda(clazz, types) {
    _init_properties_SerializersCache_kt__hgwi2p();
    var serializers = ensureNotNull(serializersForParameters(EmptySerializersModule_0(), types, true));
    var tmp0_safe_receiver = parametrizedSerializerOrNull(clazz, serializers, PARAMETRIZED_SERIALIZERS_CACHE_NULLABLE$lambda$lambda(types));
    var tmp1_safe_receiver = tmp0_safe_receiver == null ? null : get_nullable(tmp0_safe_receiver);
    var tmp;
    if (tmp1_safe_receiver == null) {
      tmp = null;
    } else {
      // Inline function 'kotlinx.serialization.internal.cast' call
      tmp = isInterface(tmp1_safe_receiver, KSerializer) ? tmp1_safe_receiver : THROW_CCE();
    }
    return tmp;
  }
  function PARAMETRIZED_SERIALIZERS_CACHE_NULLABLE$lambda$lambda($types) {
    return function () {
      return $types.k(0).n9();
    };
  }
  var properties_initialized_SerializersCache_kt_q8kf25;
  function _init_properties_SerializersCache_kt__hgwi2p() {
    if (!properties_initialized_SerializersCache_kt_q8kf25) {
      properties_initialized_SerializersCache_kt_q8kf25 = true;
      SERIALIZERS_CACHE = createCache(SERIALIZERS_CACHE$lambda);
      SERIALIZERS_CACHE_NULLABLE = createCache(SERIALIZERS_CACHE_NULLABLE$lambda);
      PARAMETRIZED_SERIALIZERS_CACHE = createParametrizedCache(PARAMETRIZED_SERIALIZERS_CACHE$lambda);
      PARAMETRIZED_SERIALIZERS_CACHE_NULLABLE = createParametrizedCache(PARAMETRIZED_SERIALIZERS_CACHE_NULLABLE$lambda);
    }
  }
  function get_nullable(_this__u8e3s4) {
    var tmp;
    if (_this__u8e3s4.oi().oj()) {
      tmp = isInterface(_this__u8e3s4, KSerializer) ? _this__u8e3s4 : THROW_CCE();
    } else {
      tmp = new NullableSerializer(_this__u8e3s4);
    }
    return tmp;
  }
  function serializer_0(_this__u8e3s4) {
    return StringSerializer_getInstance();
  }
  function serializer_1(_this__u8e3s4) {
    return CharSerializer_getInstance();
  }
  function CharArraySerializer() {
    return CharArraySerializer_getInstance();
  }
  function serializer_2(_this__u8e3s4) {
    return DoubleSerializer_getInstance();
  }
  function DoubleArraySerializer() {
    return DoubleArraySerializer_getInstance();
  }
  function serializer_3(_this__u8e3s4) {
    return FloatSerializer_getInstance();
  }
  function FloatArraySerializer() {
    return FloatArraySerializer_getInstance();
  }
  function serializer_4(_this__u8e3s4) {
    return LongSerializer_getInstance();
  }
  function LongArraySerializer() {
    return LongArraySerializer_getInstance();
  }
  function serializer_5(_this__u8e3s4) {
    return ULongSerializer_getInstance();
  }
  function ULongArraySerializer() {
    return ULongArraySerializer_getInstance();
  }
  function serializer_6(_this__u8e3s4) {
    return IntSerializer_getInstance();
  }
  function IntArraySerializer() {
    return IntArraySerializer_getInstance();
  }
  function serializer_7(_this__u8e3s4) {
    return UIntSerializer_getInstance();
  }
  function UIntArraySerializer() {
    return UIntArraySerializer_getInstance();
  }
  function serializer_8(_this__u8e3s4) {
    return ShortSerializer_getInstance();
  }
  function ShortArraySerializer() {
    return ShortArraySerializer_getInstance();
  }
  function serializer_9(_this__u8e3s4) {
    return UShortSerializer_getInstance();
  }
  function UShortArraySerializer() {
    return UShortArraySerializer_getInstance();
  }
  function serializer_10(_this__u8e3s4) {
    return ByteSerializer_getInstance();
  }
  function ByteArraySerializer() {
    return ByteArraySerializer_getInstance();
  }
  function serializer_11(_this__u8e3s4) {
    return UByteSerializer_getInstance();
  }
  function UByteArraySerializer() {
    return UByteArraySerializer_getInstance();
  }
  function serializer_12(_this__u8e3s4) {
    return BooleanSerializer_getInstance();
  }
  function BooleanArraySerializer() {
    return BooleanArraySerializer_getInstance();
  }
  function serializer_13(_this__u8e3s4) {
    return UnitSerializer_getInstance();
  }
  function NothingSerializer() {
    return NothingSerializer_getInstance();
  }
  function serializer_14(_this__u8e3s4) {
    return DurationSerializer_getInstance();
  }
  function serializer_15(_this__u8e3s4) {
    return UuidSerializer_getInstance();
  }
  function MapEntrySerializer(keySerializer, valueSerializer) {
    return new MapEntrySerializer_0(keySerializer, valueSerializer);
  }
  function PairSerializer(keySerializer, valueSerializer) {
    return new PairSerializer_0(keySerializer, valueSerializer);
  }
  function TripleSerializer(aSerializer, bSerializer, cSerializer) {
    return new TripleSerializer_0(aSerializer, bSerializer, cSerializer);
  }
  function ArraySerializer(kClass, elementSerializer) {
    return new ReferenceArraySerializer(kClass, elementSerializer);
  }
  function MapSerializer(keySerializer, valueSerializer) {
    return new LinkedHashMapSerializer(keySerializer, valueSerializer);
  }
  function ListSerializer(elementSerializer) {
    return new ArrayListSerializer(elementSerializer);
  }
  function withContext(_this__u8e3s4, context) {
    return new ContextDescriptor(_this__u8e3s4, context);
  }
  function ContextDescriptor(original, kClass) {
    this.pj_1 = original;
    this.qj_1 = kClass;
    this.rj_1 = this.pj_1.sj() + '<' + this.qj_1.z8() + '>';
  }
  protoOf(ContextDescriptor).sj = function () {
    return this.rj_1;
  };
  protoOf(ContextDescriptor).equals = function (other) {
    var tmp0_elvis_lhs = other instanceof ContextDescriptor ? other : null;
    var tmp;
    if (tmp0_elvis_lhs == null) {
      return false;
    } else {
      tmp = tmp0_elvis_lhs;
    }
    var another = tmp;
    return equals(this.pj_1, another.pj_1) && another.qj_1.equals(this.qj_1);
  };
  protoOf(ContextDescriptor).hashCode = function () {
    var result = this.qj_1.hashCode();
    result = imul(31, result) + getStringHashCode(this.rj_1) | 0;
    return result;
  };
  protoOf(ContextDescriptor).toString = function () {
    return 'ContextDescriptor(kClass: ' + toString(this.qj_1) + ', original: ' + toString(this.pj_1) + ')';
  };
  protoOf(ContextDescriptor).tj = function () {
    return this.pj_1.tj();
  };
  protoOf(ContextDescriptor).oj = function () {
    return this.pj_1.oj();
  };
  protoOf(ContextDescriptor).uj = function () {
    return this.pj_1.uj();
  };
  protoOf(ContextDescriptor).vj = function () {
    return this.pj_1.vj();
  };
  protoOf(ContextDescriptor).wj = function () {
    return this.pj_1.wj();
  };
  protoOf(ContextDescriptor).xj = function (index) {
    return this.pj_1.xj(index);
  };
  protoOf(ContextDescriptor).yj = function (name) {
    return this.pj_1.yj(name);
  };
  protoOf(ContextDescriptor).zj = function (index) {
    return this.pj_1.zj(index);
  };
  protoOf(ContextDescriptor).ak = function (index) {
    return this.pj_1.ak(index);
  };
  protoOf(ContextDescriptor).bk = function (index) {
    return this.pj_1.bk(index);
  };
  function getContextualDescriptor(_this__u8e3s4, descriptor) {
    var tmp0_safe_receiver = get_capturedKClass(descriptor);
    var tmp;
    if (tmp0_safe_receiver == null) {
      tmp = null;
    } else {
      // Inline function 'kotlin.let' call
      var tmp0_safe_receiver_0 = _this__u8e3s4.kj(tmp0_safe_receiver);
      tmp = tmp0_safe_receiver_0 == null ? null : tmp0_safe_receiver_0.oi();
    }
    return tmp;
  }
  function get_capturedKClass(_this__u8e3s4) {
    var tmp;
    if (_this__u8e3s4 instanceof ContextDescriptor) {
      tmp = _this__u8e3s4.qj_1;
    } else {
      if (_this__u8e3s4 instanceof SerialDescriptorForNullable) {
        tmp = get_capturedKClass(_this__u8e3s4.ck_1);
      } else {
        tmp = null;
      }
    }
    return tmp;
  }
  function SerialDescriptor() {
  }
  function get_elementDescriptors(_this__u8e3s4) {
    // Inline function 'kotlin.collections.Iterable' call
    return new elementDescriptors$$inlined$Iterable$1(_this__u8e3s4);
  }
  function get_elementNames(_this__u8e3s4) {
    // Inline function 'kotlin.collections.Iterable' call
    return new elementNames$$inlined$Iterable$1(_this__u8e3s4);
  }
  function elementDescriptors$1($this_elementDescriptors) {
    this.gk_1 = $this_elementDescriptors;
    this.fk_1 = $this_elementDescriptors.vj();
  }
  protoOf(elementDescriptors$1).h = function () {
    return this.fk_1 > 0;
  };
  protoOf(elementDescriptors$1).i = function () {
    var tmp = this.gk_1.vj();
    var _unary__edvuaz = this.fk_1;
    this.fk_1 = _unary__edvuaz - 1 | 0;
    return this.gk_1.ak(tmp - _unary__edvuaz | 0);
  };
  function elementDescriptors$$inlined$Iterable$1($this_elementDescriptors) {
    this.hk_1 = $this_elementDescriptors;
  }
  protoOf(elementDescriptors$$inlined$Iterable$1).g = function () {
    return new elementDescriptors$1(this.hk_1);
  };
  function elementNames$1($this_elementNames) {
    this.jk_1 = $this_elementNames;
    this.ik_1 = $this_elementNames.vj();
  }
  protoOf(elementNames$1).h = function () {
    return this.ik_1 > 0;
  };
  protoOf(elementNames$1).i = function () {
    var tmp = this.jk_1.vj();
    var _unary__edvuaz = this.ik_1;
    this.ik_1 = _unary__edvuaz - 1 | 0;
    return this.jk_1.xj(tmp - _unary__edvuaz | 0);
  };
  function elementNames$$inlined$Iterable$1($this_elementNames) {
    this.kk_1 = $this_elementNames;
  }
  protoOf(elementNames$$inlined$Iterable$1).g = function () {
    return new elementNames$1(this.kk_1);
  };
  function buildSerialDescriptor(serialName, kind, typeParameters, builder) {
    var tmp;
    if (builder === VOID) {
      tmp = buildSerialDescriptor$lambda;
    } else {
      tmp = builder;
    }
    builder = tmp;
    // Inline function 'kotlin.text.isNotBlank' call
    // Inline function 'kotlin.require' call
    if (!!isBlank(serialName)) {
      var message = 'Blank serial names are prohibited';
      throw IllegalArgumentException_init_$Create$(toString(message));
    }
    // Inline function 'kotlin.require' call
    if (!!equals(kind, CLASS_getInstance())) {
      var message_0 = "For StructureKind.CLASS please use 'buildClassSerialDescriptor' instead";
      throw IllegalArgumentException_init_$Create$(toString(message_0));
    }
    var sdBuilder = new ClassSerialDescriptorBuilder(serialName);
    builder(sdBuilder);
    return new SerialDescriptorImpl(serialName, kind, sdBuilder.ui_1.j(), toList(typeParameters), sdBuilder);
  }
  function ClassSerialDescriptorBuilder(serialName) {
    this.ri_1 = serialName;
    this.si_1 = false;
    this.ti_1 = emptyList();
    this.ui_1 = ArrayList_init_$Create$_0();
    this.vi_1 = HashSet_init_$Create$();
    this.wi_1 = ArrayList_init_$Create$_0();
    this.xi_1 = ArrayList_init_$Create$_0();
    this.yi_1 = ArrayList_init_$Create$_0();
  }
  protoOf(ClassSerialDescriptorBuilder).lk = function (elementName, descriptor, annotations, isOptional) {
    // Inline function 'kotlin.require' call
    if (!this.vi_1.e(elementName)) {
      var message = "Element with name '" + elementName + "' is already registered in " + this.ri_1;
      throw IllegalArgumentException_init_$Create$(toString(message));
    }
    // Inline function 'kotlin.collections.plusAssign' call
    this.ui_1.e(elementName);
    // Inline function 'kotlin.collections.plusAssign' call
    this.wi_1.e(descriptor);
    // Inline function 'kotlin.collections.plusAssign' call
    this.xi_1.e(annotations);
    // Inline function 'kotlin.collections.plusAssign' call
    this.yi_1.e(isOptional);
  };
  protoOf(ClassSerialDescriptorBuilder).zi = function (elementName, descriptor, annotations, isOptional, $super) {
    annotations = annotations === VOID ? emptyList() : annotations;
    isOptional = isOptional === VOID ? false : isOptional;
    var tmp;
    if ($super === VOID) {
      this.lk(elementName, descriptor, annotations, isOptional);
      tmp = Unit_instance;
    } else {
      tmp = $super.lk.call(this, elementName, descriptor, annotations, isOptional);
    }
    return tmp;
  };
  function _get__hashCode__tgwhef($this) {
    var tmp0 = $this.xk_1;
    // Inline function 'kotlin.getValue' call
    _hashCode$factory();
    return tmp0.s1();
  }
  function SerialDescriptorImpl$_hashCode$delegate$lambda(this$0) {
    return function () {
      return hashCodeImpl(this$0, this$0.wk_1);
    };
  }
  function SerialDescriptorImpl$toString$lambda(this$0) {
    return function (it) {
      return this$0.xj(it) + ': ' + this$0.ak(it).sj();
    };
  }
  function SerialDescriptorImpl(serialName, kind, elementsCount, typeParameters, builder) {
    this.mk_1 = serialName;
    this.nk_1 = kind;
    this.ok_1 = elementsCount;
    this.pk_1 = builder.ti_1;
    this.qk_1 = toHashSet(builder.ui_1);
    var tmp = this;
    // Inline function 'kotlin.collections.toTypedArray' call
    var this_0 = builder.ui_1;
    tmp.rk_1 = copyToArray(this_0);
    this.sk_1 = compactArray(builder.wi_1);
    var tmp_0 = this;
    // Inline function 'kotlin.collections.toTypedArray' call
    var this_1 = builder.xi_1;
    tmp_0.tk_1 = copyToArray(this_1);
    this.uk_1 = toBooleanArray(builder.yi_1);
    var tmp_1 = this;
    // Inline function 'kotlin.collections.map' call
    var this_2 = withIndex(this.rk_1);
    // Inline function 'kotlin.collections.mapTo' call
    var destination = ArrayList_init_$Create$(collectionSizeOrDefault(this_2, 10));
    var _iterator__ex2g4s = this_2.g();
    while (_iterator__ex2g4s.h()) {
      var item = _iterator__ex2g4s.i();
      var tmp$ret$2 = to(item.zc_1, item.yc_1);
      destination.e(tmp$ret$2);
    }
    tmp_1.vk_1 = toMap(destination);
    this.wk_1 = compactArray(typeParameters);
    var tmp_2 = this;
    tmp_2.xk_1 = lazy_0(SerialDescriptorImpl$_hashCode$delegate$lambda(this));
  }
  protoOf(SerialDescriptorImpl).sj = function () {
    return this.mk_1;
  };
  protoOf(SerialDescriptorImpl).tj = function () {
    return this.nk_1;
  };
  protoOf(SerialDescriptorImpl).vj = function () {
    return this.ok_1;
  };
  protoOf(SerialDescriptorImpl).wj = function () {
    return this.pk_1;
  };
  protoOf(SerialDescriptorImpl).yk = function () {
    return this.qk_1;
  };
  protoOf(SerialDescriptorImpl).xj = function (index) {
    return getChecked(this.rk_1, index);
  };
  protoOf(SerialDescriptorImpl).yj = function (name) {
    var tmp0_elvis_lhs = this.vk_1.v1(name);
    return tmp0_elvis_lhs == null ? -3 : tmp0_elvis_lhs;
  };
  protoOf(SerialDescriptorImpl).zj = function (index) {
    return getChecked(this.tk_1, index);
  };
  protoOf(SerialDescriptorImpl).ak = function (index) {
    return getChecked(this.sk_1, index);
  };
  protoOf(SerialDescriptorImpl).bk = function (index) {
    return getChecked_0(this.uk_1, index);
  };
  protoOf(SerialDescriptorImpl).equals = function (other) {
    var tmp$ret$0;
    $l$block_5: {
      // Inline function 'kotlinx.serialization.internal.equalsImpl' call
      if (this === other) {
        tmp$ret$0 = true;
        break $l$block_5;
      }
      if (!(other instanceof SerialDescriptorImpl)) {
        tmp$ret$0 = false;
        break $l$block_5;
      }
      if (!(this.sj() === other.sj())) {
        tmp$ret$0 = false;
        break $l$block_5;
      }
      if (!contentEquals(this.wk_1, other.wk_1)) {
        tmp$ret$0 = false;
        break $l$block_5;
      }
      if (!(this.vj() === other.vj())) {
        tmp$ret$0 = false;
        break $l$block_5;
      }
      var inductionVariable = 0;
      var last = this.vj();
      if (inductionVariable < last)
        do {
          var index = inductionVariable;
          inductionVariable = inductionVariable + 1 | 0;
          if (!(this.ak(index).sj() === other.ak(index).sj())) {
            tmp$ret$0 = false;
            break $l$block_5;
          }
          if (!equals(this.ak(index).tj(), other.ak(index).tj())) {
            tmp$ret$0 = false;
            break $l$block_5;
          }
        }
         while (inductionVariable < last);
      tmp$ret$0 = true;
    }
    return tmp$ret$0;
  };
  protoOf(SerialDescriptorImpl).hashCode = function () {
    return _get__hashCode__tgwhef(this);
  };
  protoOf(SerialDescriptorImpl).toString = function () {
    var tmp = until(0, this.ok_1);
    var tmp_0 = this.mk_1 + '(';
    return joinToString(tmp, ', ', tmp_0, ')', VOID, VOID, SerialDescriptorImpl$toString$lambda(this));
  };
  function buildClassSerialDescriptor(serialName, typeParameters, builderAction) {
    var tmp;
    if (builderAction === VOID) {
      tmp = buildClassSerialDescriptor$lambda;
    } else {
      tmp = builderAction;
    }
    builderAction = tmp;
    // Inline function 'kotlin.text.isNotBlank' call
    // Inline function 'kotlin.require' call
    if (!!isBlank(serialName)) {
      var message = 'Blank serial names are prohibited';
      throw IllegalArgumentException_init_$Create$(toString(message));
    }
    var sdBuilder = new ClassSerialDescriptorBuilder(serialName);
    builderAction(sdBuilder);
    return new SerialDescriptorImpl(serialName, CLASS_getInstance(), sdBuilder.ui_1.j(), toList(typeParameters), sdBuilder);
  }
  function PrimitiveSerialDescriptor(serialName, kind) {
    // Inline function 'kotlin.text.isNotBlank' call
    // Inline function 'kotlin.require' call
    if (!!isBlank(serialName)) {
      var message = 'Blank serial names are prohibited';
      throw IllegalArgumentException_init_$Create$(toString(message));
    }
    return PrimitiveDescriptorSafe(serialName, kind);
  }
  function buildSerialDescriptor$lambda(_this__u8e3s4) {
    return Unit_instance;
  }
  function buildClassSerialDescriptor$lambda(_this__u8e3s4) {
    return Unit_instance;
  }
  function _hashCode$factory() {
    return getPropertyCallableRef('_hashCode', 1, KProperty1, function (receiver) {
      return _get__hashCode__tgwhef(receiver);
    }, null);
  }
  function ENUM() {
    ENUM_instance = this;
    SerialKind.call(this);
  }
  var ENUM_instance;
  function ENUM_getInstance() {
    if (ENUM_instance == null)
      new ENUM();
    return ENUM_instance;
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
    return ensureNotNull(getKClassFromExpression(this).z8());
  };
  protoOf(SerialKind).hashCode = function () {
    return getStringHashCode(this.toString());
  };
  function SEALED() {
    SEALED_instance = this;
    PolymorphicKind.call(this);
  }
  var SEALED_instance;
  function SEALED_getInstance() {
    if (SEALED_instance == null)
      new SEALED();
    return SEALED_instance;
  }
  function OPEN() {
    OPEN_instance = this;
    PolymorphicKind.call(this);
  }
  var OPEN_instance;
  function OPEN_getInstance() {
    if (OPEN_instance == null)
      new OPEN();
    return OPEN_instance;
  }
  function PolymorphicKind() {
    SerialKind.call(this);
  }
  function BOOLEAN() {
    BOOLEAN_instance = this;
    PrimitiveKind.call(this);
  }
  var BOOLEAN_instance;
  function BOOLEAN_getInstance() {
    if (BOOLEAN_instance == null)
      new BOOLEAN();
    return BOOLEAN_instance;
  }
  function BYTE() {
    BYTE_instance = this;
    PrimitiveKind.call(this);
  }
  var BYTE_instance;
  function BYTE_getInstance() {
    if (BYTE_instance == null)
      new BYTE();
    return BYTE_instance;
  }
  function CHAR() {
    CHAR_instance = this;
    PrimitiveKind.call(this);
  }
  var CHAR_instance;
  function CHAR_getInstance() {
    if (CHAR_instance == null)
      new CHAR();
    return CHAR_instance;
  }
  function SHORT() {
    SHORT_instance = this;
    PrimitiveKind.call(this);
  }
  var SHORT_instance;
  function SHORT_getInstance() {
    if (SHORT_instance == null)
      new SHORT();
    return SHORT_instance;
  }
  function INT() {
    INT_instance = this;
    PrimitiveKind.call(this);
  }
  var INT_instance;
  function INT_getInstance() {
    if (INT_instance == null)
      new INT();
    return INT_instance;
  }
  function LONG() {
    LONG_instance = this;
    PrimitiveKind.call(this);
  }
  var LONG_instance;
  function LONG_getInstance() {
    if (LONG_instance == null)
      new LONG();
    return LONG_instance;
  }
  function FLOAT() {
    FLOAT_instance = this;
    PrimitiveKind.call(this);
  }
  var FLOAT_instance;
  function FLOAT_getInstance() {
    if (FLOAT_instance == null)
      new FLOAT();
    return FLOAT_instance;
  }
  function DOUBLE() {
    DOUBLE_instance = this;
    PrimitiveKind.call(this);
  }
  var DOUBLE_instance;
  function DOUBLE_getInstance() {
    if (DOUBLE_instance == null)
      new DOUBLE();
    return DOUBLE_instance;
  }
  function STRING() {
    STRING_instance = this;
    PrimitiveKind.call(this);
  }
  var STRING_instance;
  function STRING_getInstance() {
    if (STRING_instance == null)
      new STRING();
    return STRING_instance;
  }
  function PrimitiveKind() {
    SerialKind.call(this);
  }
  function CLASS() {
    CLASS_instance = this;
    StructureKind.call(this);
  }
  var CLASS_instance;
  function CLASS_getInstance() {
    if (CLASS_instance == null)
      new CLASS();
    return CLASS_instance;
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
  function OBJECT() {
    OBJECT_instance = this;
    StructureKind.call(this);
  }
  var OBJECT_instance;
  function OBJECT_getInstance() {
    if (OBJECT_instance == null)
      new OBJECT();
    return OBJECT_instance;
  }
  function StructureKind() {
    SerialKind.call(this);
  }
  function AbstractDecoder() {
  }
  protoOf(AbstractDecoder).zk = function () {
    throw SerializationException_init_$Create$_0(toString(getKClassFromExpression(this)) + " can't retrieve untyped values");
  };
  protoOf(AbstractDecoder).al = function () {
    return true;
  };
  protoOf(AbstractDecoder).bl = function () {
    return null;
  };
  protoOf(AbstractDecoder).cl = function () {
    var tmp = this.zk();
    return typeof tmp === 'boolean' ? tmp : THROW_CCE();
  };
  protoOf(AbstractDecoder).dl = function () {
    var tmp = this.zk();
    return typeof tmp === 'number' ? tmp : THROW_CCE();
  };
  protoOf(AbstractDecoder).el = function () {
    var tmp = this.zk();
    return typeof tmp === 'number' ? tmp : THROW_CCE();
  };
  protoOf(AbstractDecoder).fl = function () {
    var tmp = this.zk();
    return typeof tmp === 'number' ? tmp : THROW_CCE();
  };
  protoOf(AbstractDecoder).gl = function () {
    var tmp = this.zk();
    return tmp instanceof Long ? tmp : THROW_CCE();
  };
  protoOf(AbstractDecoder).hl = function () {
    var tmp = this.zk();
    return typeof tmp === 'number' ? tmp : THROW_CCE();
  };
  protoOf(AbstractDecoder).il = function () {
    var tmp = this.zk();
    return typeof tmp === 'number' ? tmp : THROW_CCE();
  };
  protoOf(AbstractDecoder).jl = function () {
    var tmp = this.zk();
    return tmp instanceof Char ? tmp.d1_1 : THROW_CCE();
  };
  protoOf(AbstractDecoder).kl = function () {
    var tmp = this.zk();
    return typeof tmp === 'string' ? tmp : THROW_CCE();
  };
  protoOf(AbstractDecoder).ll = function (enumDescriptor) {
    var tmp = this.zk();
    return typeof tmp === 'number' ? tmp : THROW_CCE();
  };
  protoOf(AbstractDecoder).ml = function (descriptor) {
    return this;
  };
  protoOf(AbstractDecoder).nl = function (deserializer, previousValue) {
    return this.ol(deserializer);
  };
  protoOf(AbstractDecoder).pl = function (descriptor) {
    return this;
  };
  protoOf(AbstractDecoder).ql = function (descriptor) {
  };
  protoOf(AbstractDecoder).rl = function (descriptor, index) {
    return this.cl();
  };
  protoOf(AbstractDecoder).sl = function (descriptor, index) {
    return this.dl();
  };
  protoOf(AbstractDecoder).tl = function (descriptor, index) {
    return this.el();
  };
  protoOf(AbstractDecoder).ul = function (descriptor, index) {
    return this.fl();
  };
  protoOf(AbstractDecoder).vl = function (descriptor, index) {
    return this.gl();
  };
  protoOf(AbstractDecoder).wl = function (descriptor, index) {
    return this.hl();
  };
  protoOf(AbstractDecoder).xl = function (descriptor, index) {
    return this.il();
  };
  protoOf(AbstractDecoder).yl = function (descriptor, index) {
    return this.jl();
  };
  protoOf(AbstractDecoder).zl = function (descriptor, index) {
    return this.kl();
  };
  protoOf(AbstractDecoder).am = function (descriptor, index) {
    return this.ml(descriptor.ak(index));
  };
  protoOf(AbstractDecoder).bm = function (descriptor, index, deserializer, previousValue) {
    return this.nl(deserializer, previousValue);
  };
  protoOf(AbstractDecoder).dm = function (descriptor, index, deserializer, previousValue) {
    // Inline function 'kotlinx.serialization.encoding.decodeIfNullable' call
    var isNullabilitySupported = deserializer.oi().oj();
    var tmp;
    if (isNullabilitySupported || this.al()) {
      tmp = this.nl(deserializer, previousValue);
    } else {
      tmp = this.bl();
    }
    return tmp;
  };
  function AbstractEncoder() {
  }
  protoOf(AbstractEncoder).pl = function (descriptor) {
    return this;
  };
  protoOf(AbstractEncoder).ql = function (descriptor) {
  };
  protoOf(AbstractEncoder).im = function (descriptor, index) {
    return true;
  };
  protoOf(AbstractEncoder).jm = function (value) {
    throw SerializationException_init_$Create$_0('Non-serializable ' + toString(getKClassFromExpression(value)) + ' is not supported by ' + toString(getKClassFromExpression(this)) + ' encoder');
  };
  protoOf(AbstractEncoder).km = function () {
    throw SerializationException_init_$Create$_0("'null' is not supported by default");
  };
  protoOf(AbstractEncoder).lm = function (value) {
    return this.jm(value);
  };
  protoOf(AbstractEncoder).mm = function (value) {
    return this.jm(value);
  };
  protoOf(AbstractEncoder).nm = function (value) {
    return this.jm(value);
  };
  protoOf(AbstractEncoder).om = function (value) {
    return this.jm(value);
  };
  protoOf(AbstractEncoder).pm = function (value) {
    return this.jm(value);
  };
  protoOf(AbstractEncoder).qm = function (value) {
    return this.jm(value);
  };
  protoOf(AbstractEncoder).rm = function (value) {
    return this.jm(value);
  };
  protoOf(AbstractEncoder).sm = function (value) {
    return this.jm(new Char(value));
  };
  protoOf(AbstractEncoder).tm = function (value) {
    return this.jm(value);
  };
  protoOf(AbstractEncoder).um = function (enumDescriptor, index) {
    return this.jm(index);
  };
  protoOf(AbstractEncoder).vm = function (descriptor) {
    return this;
  };
  protoOf(AbstractEncoder).wm = function (descriptor, index, value) {
    if (this.im(descriptor, index)) {
      this.lm(value);
    }
  };
  protoOf(AbstractEncoder).xm = function (descriptor, index, value) {
    if (this.im(descriptor, index)) {
      this.mm(value);
    }
  };
  protoOf(AbstractEncoder).ym = function (descriptor, index, value) {
    if (this.im(descriptor, index)) {
      this.nm(value);
    }
  };
  protoOf(AbstractEncoder).zm = function (descriptor, index, value) {
    if (this.im(descriptor, index)) {
      this.om(value);
    }
  };
  protoOf(AbstractEncoder).an = function (descriptor, index, value) {
    if (this.im(descriptor, index)) {
      this.pm(value);
    }
  };
  protoOf(AbstractEncoder).bn = function (descriptor, index, value) {
    if (this.im(descriptor, index)) {
      this.qm(value);
    }
  };
  protoOf(AbstractEncoder).cn = function (descriptor, index, value) {
    if (this.im(descriptor, index)) {
      this.rm(value);
    }
  };
  protoOf(AbstractEncoder).dn = function (descriptor, index, value) {
    if (this.im(descriptor, index)) {
      this.sm(value);
    }
  };
  protoOf(AbstractEncoder).en = function (descriptor, index, value) {
    if (this.im(descriptor, index)) {
      this.tm(value);
    }
  };
  protoOf(AbstractEncoder).fn = function (descriptor, index) {
    return this.im(descriptor, index) ? this.vm(descriptor.ak(index)) : NoOpEncoder_getInstance();
  };
  protoOf(AbstractEncoder).gn = function (descriptor, index, serializer, value) {
    if (this.im(descriptor, index)) {
      this.hn(serializer, value);
    }
  };
  protoOf(AbstractEncoder).in = function (descriptor, index, serializer, value) {
    if (this.im(descriptor, index)) {
      this.jn(serializer, value);
    }
  };
  function Decoder() {
  }
  function CompositeDecoder() {
  }
  function Encoder() {
  }
  function CompositeEncoder() {
  }
  function decodeSequentially_0($this, compositeDecoder) {
    var klassName = compositeDecoder.zl($this.oi(), 0);
    var serializer = findPolymorphicSerializer_0($this, compositeDecoder, klassName);
    return compositeDecoder.cm($this.oi(), 1, serializer);
  }
  function AbstractPolymorphicSerializer() {
  }
  protoOf(AbstractPolymorphicSerializer).ej = function (encoder, value) {
    var actualSerializer = findPolymorphicSerializer(this, encoder, value);
    // Inline function 'kotlinx.serialization.encoding.encodeStructure' call
    var descriptor = this.oi();
    var composite = encoder.pl(descriptor);
    composite.en(this.oi(), 0, actualSerializer.oi().sj());
    var tmp = this.oi();
    // Inline function 'kotlinx.serialization.internal.cast' call
    var tmp$ret$0 = isInterface(actualSerializer, SerializationStrategy) ? actualSerializer : THROW_CCE();
    composite.gn(tmp, 1, tmp$ret$0, value);
    composite.ql(descriptor);
  };
  protoOf(AbstractPolymorphicSerializer).pi = function (encoder, value) {
    return this.ej(encoder, !(value == null) ? value : THROW_CCE());
  };
  protoOf(AbstractPolymorphicSerializer).qi = function (decoder) {
    // Inline function 'kotlinx.serialization.encoding.decodeStructure' call
    var descriptor = this.oi();
    var composite = decoder.pl(descriptor);
    var tmp$ret$0;
    $l$block: {
      var klassName = null;
      var value = null;
      if (composite.fm()) {
        tmp$ret$0 = decodeSequentially_0(this, composite);
        break $l$block;
      }
      mainLoop: while (true) {
        var index = composite.gm(this.oi());
        switch (index) {
          case -1:
            break mainLoop;
          case 0:
            klassName = composite.zl(this.oi(), index);
            break;
          case 1:
            var tmp0 = klassName;
            var tmp$ret$2;
            $l$block_0: {
              // Inline function 'kotlin.requireNotNull' call
              if (tmp0 == null) {
                var message = 'Cannot read polymorphic value before its type token';
                throw IllegalArgumentException_init_$Create$(toString(message));
              } else {
                tmp$ret$2 = tmp0;
                break $l$block_0;
              }
            }

            klassName = tmp$ret$2;
            var serializer = findPolymorphicSerializer_0(this, composite, klassName);
            value = composite.cm(this.oi(), index, serializer);
            break;
          default:
            var tmp0_elvis_lhs = klassName;
            throw SerializationException_init_$Create$_0('Invalid index in polymorphic deserialization of ' + (tmp0_elvis_lhs == null ? 'unknown class' : tmp0_elvis_lhs) + ('\n Expected 0, 1 or DECODE_DONE(-1), but found ' + index));
        }
      }
      var tmp1 = value;
      var tmp$ret$4;
      $l$block_1: {
        // Inline function 'kotlin.requireNotNull' call
        if (tmp1 == null) {
          var message_0 = 'Polymorphic value has not been read for class ' + klassName;
          throw IllegalArgumentException_init_$Create$(toString(message_0));
        } else {
          tmp$ret$4 = tmp1;
          break $l$block_1;
        }
      }
      var tmp = tmp$ret$4;
      tmp$ret$0 = !(tmp == null) ? tmp : THROW_CCE();
    }
    var result = tmp$ret$0;
    composite.ql(descriptor);
    return result;
  };
  protoOf(AbstractPolymorphicSerializer).fj = function (decoder, klassName) {
    return decoder.em().nn(this.dj(), klassName);
  };
  protoOf(AbstractPolymorphicSerializer).gj = function (encoder, value) {
    return encoder.em().on(this.dj(), value);
  };
  function throwSubtypeNotRegistered(subClass, baseClass) {
    var tmp0_elvis_lhs = subClass.z8();
    throwSubtypeNotRegistered_0(tmp0_elvis_lhs == null ? toString(subClass) : tmp0_elvis_lhs, baseClass);
  }
  function throwSubtypeNotRegistered_0(subClassName, baseClass) {
    var scope = "in the polymorphic scope of '" + baseClass.z8() + "'";
    throw SerializationException_init_$Create$_0(subClassName == null ? 'Class discriminator was missing and no default serializers were registered ' + scope + '.' : "Serializer for subclass '" + subClassName + "' is not found " + scope + '.\n' + ("Check if class with serial name '" + subClassName + "' exists and serializer is registered in a corresponding SerializersModule.\n") + ("To be registered automatically, class '" + subClassName + "' has to be '@Serializable', and the base class '" + baseClass.z8() + "' has to be sealed and '@Serializable'."));
  }
  function NothingSerializer_0() {
    NothingSerializer_instance = this;
    this.pn_1 = NothingSerialDescriptor_getInstance();
  }
  protoOf(NothingSerializer_0).oi = function () {
    return this.pn_1;
  };
  protoOf(NothingSerializer_0).qn = function (encoder, value) {
    throw SerializationException_init_$Create$_0("'kotlin.Nothing' cannot be serialized");
  };
  protoOf(NothingSerializer_0).pi = function (encoder, value) {
    var tmp;
    if (false) {
      tmp = value;
    } else {
      tmp = THROW_CCE();
    }
    return this.qn(encoder, tmp);
  };
  protoOf(NothingSerializer_0).qi = function (decoder) {
    throw SerializationException_init_$Create$_0("'kotlin.Nothing' does not have instances");
  };
  var NothingSerializer_instance;
  function NothingSerializer_getInstance() {
    if (NothingSerializer_instance == null)
      new NothingSerializer_0();
    return NothingSerializer_instance;
  }
  function DurationSerializer() {
    DurationSerializer_instance = this;
    this.rn_1 = new PrimitiveSerialDescriptor_0('kotlin.time.Duration', STRING_getInstance());
  }
  protoOf(DurationSerializer).oi = function () {
    return this.rn_1;
  };
  protoOf(DurationSerializer).sn = function (encoder, value) {
    encoder.tm(Duration__toIsoString_impl_9h6wsm(value));
  };
  protoOf(DurationSerializer).pi = function (encoder, value) {
    return this.sn(encoder, value instanceof Duration ? value.dg_1 : THROW_CCE());
  };
  protoOf(DurationSerializer).tn = function (decoder) {
    return Companion_getInstance().cg(decoder.kl());
  };
  protoOf(DurationSerializer).qi = function (decoder) {
    return new Duration(this.tn(decoder));
  };
  var DurationSerializer_instance;
  function DurationSerializer_getInstance() {
    if (DurationSerializer_instance == null)
      new DurationSerializer();
    return DurationSerializer_instance;
  }
  function UuidSerializer() {
    UuidSerializer_instance = this;
    this.un_1 = new PrimitiveSerialDescriptor_0('kotlin.uuid.Uuid', STRING_getInstance());
  }
  protoOf(UuidSerializer).oi = function () {
    return this.un_1;
  };
  protoOf(UuidSerializer).vn = function (encoder, value) {
    encoder.tm(value.toString());
  };
  protoOf(UuidSerializer).pi = function (encoder, value) {
    return this.vn(encoder, value instanceof Uuid ? value : THROW_CCE());
  };
  protoOf(UuidSerializer).qi = function (decoder) {
    return Companion_getInstance_0().vg(decoder.kl());
  };
  var UuidSerializer_instance;
  function UuidSerializer_getInstance() {
    if (UuidSerializer_instance == null)
      new UuidSerializer();
    return UuidSerializer_instance;
  }
  function CachedNames() {
  }
  function ArrayListClassDesc(elementDesc) {
    ListLikeDescriptor.call(this, elementDesc);
  }
  protoOf(ArrayListClassDesc).sj = function () {
    return 'kotlin.collections.ArrayList';
  };
  function HashSetClassDesc(elementDesc) {
    ListLikeDescriptor.call(this, elementDesc);
  }
  protoOf(HashSetClassDesc).sj = function () {
    return 'kotlin.collections.HashSet';
  };
  function LinkedHashSetClassDesc(elementDesc) {
    ListLikeDescriptor.call(this, elementDesc);
  }
  protoOf(LinkedHashSetClassDesc).sj = function () {
    return 'kotlin.collections.LinkedHashSet';
  };
  function HashMapClassDesc(keyDesc, valueDesc) {
    MapLikeDescriptor.call(this, 'kotlin.collections.HashMap', keyDesc, valueDesc);
  }
  function LinkedHashMapClassDesc(keyDesc, valueDesc) {
    MapLikeDescriptor.call(this, 'kotlin.collections.LinkedHashMap', keyDesc, valueDesc);
  }
  function ArrayClassDesc(elementDesc) {
    ListLikeDescriptor.call(this, elementDesc);
  }
  protoOf(ArrayClassDesc).sj = function () {
    return 'kotlin.Array';
  };
  function ListLikeDescriptor(elementDescriptor) {
    this.yn_1 = elementDescriptor;
    this.zn_1 = 1;
  }
  protoOf(ListLikeDescriptor).tj = function () {
    return LIST_getInstance();
  };
  protoOf(ListLikeDescriptor).vj = function () {
    return this.zn_1;
  };
  protoOf(ListLikeDescriptor).xj = function (index) {
    return index.toString();
  };
  protoOf(ListLikeDescriptor).yj = function (name) {
    var tmp0_elvis_lhs = toIntOrNull(name);
    var tmp;
    if (tmp0_elvis_lhs == null) {
      throw IllegalArgumentException_init_$Create$(name + ' is not a valid list index');
    } else {
      tmp = tmp0_elvis_lhs;
    }
    return tmp;
  };
  protoOf(ListLikeDescriptor).bk = function (index) {
    // Inline function 'kotlin.require' call
    if (!(index >= 0)) {
      var message = 'Illegal index ' + index + ', ' + this.sj() + ' expects only non-negative indices';
      throw IllegalArgumentException_init_$Create$(toString(message));
    }
    return false;
  };
  protoOf(ListLikeDescriptor).zj = function (index) {
    // Inline function 'kotlin.require' call
    if (!(index >= 0)) {
      var message = 'Illegal index ' + index + ', ' + this.sj() + ' expects only non-negative indices';
      throw IllegalArgumentException_init_$Create$(toString(message));
    }
    return emptyList();
  };
  protoOf(ListLikeDescriptor).ak = function (index) {
    // Inline function 'kotlin.require' call
    if (!(index >= 0)) {
      var message = 'Illegal index ' + index + ', ' + this.sj() + ' expects only non-negative indices';
      throw IllegalArgumentException_init_$Create$(toString(message));
    }
    return this.yn_1;
  };
  protoOf(ListLikeDescriptor).equals = function (other) {
    if (this === other)
      return true;
    if (!(other instanceof ListLikeDescriptor))
      return false;
    if (equals(this.yn_1, other.yn_1) && this.sj() === other.sj())
      return true;
    return false;
  };
  protoOf(ListLikeDescriptor).hashCode = function () {
    return imul(hashCode(this.yn_1), 31) + getStringHashCode(this.sj()) | 0;
  };
  protoOf(ListLikeDescriptor).toString = function () {
    return this.sj() + '(' + toString(this.yn_1) + ')';
  };
  function MapLikeDescriptor(serialName, keyDescriptor, valueDescriptor) {
    this.eo_1 = serialName;
    this.fo_1 = keyDescriptor;
    this.go_1 = valueDescriptor;
    this.ho_1 = 2;
  }
  protoOf(MapLikeDescriptor).sj = function () {
    return this.eo_1;
  };
  protoOf(MapLikeDescriptor).tj = function () {
    return MAP_getInstance();
  };
  protoOf(MapLikeDescriptor).vj = function () {
    return this.ho_1;
  };
  protoOf(MapLikeDescriptor).xj = function (index) {
    return index.toString();
  };
  protoOf(MapLikeDescriptor).yj = function (name) {
    var tmp0_elvis_lhs = toIntOrNull(name);
    var tmp;
    if (tmp0_elvis_lhs == null) {
      throw IllegalArgumentException_init_$Create$(name + ' is not a valid map index');
    } else {
      tmp = tmp0_elvis_lhs;
    }
    return tmp;
  };
  protoOf(MapLikeDescriptor).bk = function (index) {
    // Inline function 'kotlin.require' call
    if (!(index >= 0)) {
      var message = 'Illegal index ' + index + ', ' + this.sj() + ' expects only non-negative indices';
      throw IllegalArgumentException_init_$Create$(toString(message));
    }
    return false;
  };
  protoOf(MapLikeDescriptor).zj = function (index) {
    // Inline function 'kotlin.require' call
    if (!(index >= 0)) {
      var message = 'Illegal index ' + index + ', ' + this.sj() + ' expects only non-negative indices';
      throw IllegalArgumentException_init_$Create$(toString(message));
    }
    return emptyList();
  };
  protoOf(MapLikeDescriptor).ak = function (index) {
    // Inline function 'kotlin.require' call
    if (!(index >= 0)) {
      var message = 'Illegal index ' + index + ', ' + this.sj() + ' expects only non-negative indices';
      throw IllegalArgumentException_init_$Create$(toString(message));
    }
    var tmp;
    switch (index % 2 | 0) {
      case 0:
        tmp = this.fo_1;
        break;
      case 1:
        tmp = this.go_1;
        break;
      default:
        var message_0 = 'Unreached';
        throw IllegalStateException_init_$Create$(toString(message_0));
    }
    return tmp;
  };
  protoOf(MapLikeDescriptor).equals = function (other) {
    if (this === other)
      return true;
    if (!(other instanceof MapLikeDescriptor))
      return false;
    if (!(this.sj() === other.sj()))
      return false;
    if (!equals(this.fo_1, other.fo_1))
      return false;
    if (!equals(this.go_1, other.go_1))
      return false;
    return true;
  };
  protoOf(MapLikeDescriptor).hashCode = function () {
    var result = getStringHashCode(this.sj());
    result = imul(31, result) + hashCode(this.fo_1) | 0;
    result = imul(31, result) + hashCode(this.go_1) | 0;
    return result;
  };
  protoOf(MapLikeDescriptor).toString = function () {
    return this.sj() + '(' + toString(this.fo_1) + ', ' + toString(this.go_1) + ')';
  };
  function PrimitiveArrayDescriptor(primitive) {
    ListLikeDescriptor.call(this, primitive);
    this.mo_1 = primitive.sj() + 'Array';
  }
  protoOf(PrimitiveArrayDescriptor).sj = function () {
    return this.mo_1;
  };
  function ArrayListSerializer(element) {
    CollectionSerializer.call(this, element);
    this.oo_1 = new ArrayListClassDesc(element.oi());
  }
  protoOf(ArrayListSerializer).oi = function () {
    return this.oo_1;
  };
  protoOf(ArrayListSerializer).po = function () {
    // Inline function 'kotlin.collections.arrayListOf' call
    return ArrayList_init_$Create$_0();
  };
  protoOf(ArrayListSerializer).qo = function (_this__u8e3s4) {
    return _this__u8e3s4.j();
  };
  protoOf(ArrayListSerializer).ro = function (_this__u8e3s4) {
    return this.qo(_this__u8e3s4 instanceof ArrayList ? _this__u8e3s4 : THROW_CCE());
  };
  protoOf(ArrayListSerializer).so = function (_this__u8e3s4) {
    return _this__u8e3s4;
  };
  protoOf(ArrayListSerializer).to = function (_this__u8e3s4) {
    return this.so(_this__u8e3s4 instanceof ArrayList ? _this__u8e3s4 : THROW_CCE());
  };
  protoOf(ArrayListSerializer).uo = function (_this__u8e3s4) {
    var tmp0_elvis_lhs = _this__u8e3s4 instanceof ArrayList ? _this__u8e3s4 : null;
    return tmp0_elvis_lhs == null ? ArrayList_init_$Create$_1(_this__u8e3s4) : tmp0_elvis_lhs;
  };
  protoOf(ArrayListSerializer).vo = function (_this__u8e3s4) {
    return this.uo((!(_this__u8e3s4 == null) ? isInterface(_this__u8e3s4, KtList) : false) ? _this__u8e3s4 : THROW_CCE());
  };
  protoOf(ArrayListSerializer).wo = function (_this__u8e3s4, size) {
    return _this__u8e3s4.n4(size);
  };
  protoOf(ArrayListSerializer).xo = function (_this__u8e3s4, size) {
    return this.wo(_this__u8e3s4 instanceof ArrayList ? _this__u8e3s4 : THROW_CCE(), size);
  };
  protoOf(ArrayListSerializer).yo = function (_this__u8e3s4, index, element) {
    _this__u8e3s4.u3(index, element);
  };
  protoOf(ArrayListSerializer).zo = function (_this__u8e3s4, index, element) {
    var tmp = _this__u8e3s4 instanceof ArrayList ? _this__u8e3s4 : THROW_CCE();
    return this.yo(tmp, index, (element == null ? true : !(element == null)) ? element : THROW_CCE());
  };
  function HashSetSerializer(eSerializer) {
    CollectionSerializer.call(this, eSerializer);
    this.kp_1 = new HashSetClassDesc(eSerializer.oi());
  }
  protoOf(HashSetSerializer).oi = function () {
    return this.kp_1;
  };
  protoOf(HashSetSerializer).po = function () {
    return HashSet_init_$Create$();
  };
  protoOf(HashSetSerializer).lp = function (_this__u8e3s4) {
    return _this__u8e3s4.j();
  };
  protoOf(HashSetSerializer).ro = function (_this__u8e3s4) {
    return this.lp(_this__u8e3s4 instanceof HashSet ? _this__u8e3s4 : THROW_CCE());
  };
  protoOf(HashSetSerializer).mp = function (_this__u8e3s4) {
    return _this__u8e3s4;
  };
  protoOf(HashSetSerializer).to = function (_this__u8e3s4) {
    return this.mp(_this__u8e3s4 instanceof HashSet ? _this__u8e3s4 : THROW_CCE());
  };
  protoOf(HashSetSerializer).np = function (_this__u8e3s4) {
    var tmp0_elvis_lhs = _this__u8e3s4 instanceof HashSet ? _this__u8e3s4 : null;
    return tmp0_elvis_lhs == null ? HashSet_init_$Create$_0(_this__u8e3s4) : tmp0_elvis_lhs;
  };
  protoOf(HashSetSerializer).vo = function (_this__u8e3s4) {
    return this.np((!(_this__u8e3s4 == null) ? isInterface(_this__u8e3s4, KtSet) : false) ? _this__u8e3s4 : THROW_CCE());
  };
  protoOf(HashSetSerializer).op = function (_this__u8e3s4, size) {
  };
  protoOf(HashSetSerializer).xo = function (_this__u8e3s4, size) {
    return this.op(_this__u8e3s4 instanceof HashSet ? _this__u8e3s4 : THROW_CCE(), size);
  };
  protoOf(HashSetSerializer).pp = function (_this__u8e3s4, index, element) {
    _this__u8e3s4.e(element);
  };
  protoOf(HashSetSerializer).zo = function (_this__u8e3s4, index, element) {
    var tmp = _this__u8e3s4 instanceof HashSet ? _this__u8e3s4 : THROW_CCE();
    return this.pp(tmp, index, (element == null ? true : !(element == null)) ? element : THROW_CCE());
  };
  function LinkedHashSetSerializer(eSerializer) {
    CollectionSerializer.call(this, eSerializer);
    this.rp_1 = new LinkedHashSetClassDesc(eSerializer.oi());
  }
  protoOf(LinkedHashSetSerializer).oi = function () {
    return this.rp_1;
  };
  protoOf(LinkedHashSetSerializer).po = function () {
    // Inline function 'kotlin.collections.linkedSetOf' call
    return LinkedHashSet_init_$Create$();
  };
  protoOf(LinkedHashSetSerializer).sp = function (_this__u8e3s4) {
    return _this__u8e3s4.j();
  };
  protoOf(LinkedHashSetSerializer).ro = function (_this__u8e3s4) {
    return this.sp(_this__u8e3s4 instanceof LinkedHashSet ? _this__u8e3s4 : THROW_CCE());
  };
  protoOf(LinkedHashSetSerializer).tp = function (_this__u8e3s4) {
    return _this__u8e3s4;
  };
  protoOf(LinkedHashSetSerializer).to = function (_this__u8e3s4) {
    return this.tp(_this__u8e3s4 instanceof LinkedHashSet ? _this__u8e3s4 : THROW_CCE());
  };
  protoOf(LinkedHashSetSerializer).np = function (_this__u8e3s4) {
    var tmp0_elvis_lhs = _this__u8e3s4 instanceof LinkedHashSet ? _this__u8e3s4 : null;
    return tmp0_elvis_lhs == null ? LinkedHashSet_init_$Create$_0(_this__u8e3s4) : tmp0_elvis_lhs;
  };
  protoOf(LinkedHashSetSerializer).vo = function (_this__u8e3s4) {
    return this.np((!(_this__u8e3s4 == null) ? isInterface(_this__u8e3s4, KtSet) : false) ? _this__u8e3s4 : THROW_CCE());
  };
  protoOf(LinkedHashSetSerializer).up = function (_this__u8e3s4, size) {
  };
  protoOf(LinkedHashSetSerializer).xo = function (_this__u8e3s4, size) {
    return this.up(_this__u8e3s4 instanceof LinkedHashSet ? _this__u8e3s4 : THROW_CCE(), size);
  };
  protoOf(LinkedHashSetSerializer).vp = function (_this__u8e3s4, index, element) {
    _this__u8e3s4.e(element);
  };
  protoOf(LinkedHashSetSerializer).zo = function (_this__u8e3s4, index, element) {
    var tmp = _this__u8e3s4 instanceof LinkedHashSet ? _this__u8e3s4 : THROW_CCE();
    return this.vp(tmp, index, (element == null ? true : !(element == null)) ? element : THROW_CCE());
  };
  function HashMapSerializer(kSerializer, vSerializer) {
    MapLikeSerializer.call(this, kSerializer, vSerializer);
    this.yp_1 = new HashMapClassDesc(kSerializer.oi(), vSerializer.oi());
  }
  protoOf(HashMapSerializer).oi = function () {
    return this.yp_1;
  };
  protoOf(HashMapSerializer).zp = function (_this__u8e3s4) {
    return _this__u8e3s4.j();
  };
  protoOf(HashMapSerializer).aq = function (_this__u8e3s4) {
    return this.zp((!(_this__u8e3s4 == null) ? isInterface(_this__u8e3s4, KtMap) : false) ? _this__u8e3s4 : THROW_CCE());
  };
  protoOf(HashMapSerializer).bq = function (_this__u8e3s4) {
    // Inline function 'kotlin.collections.iterator' call
    return _this__u8e3s4.y1().g();
  };
  protoOf(HashMapSerializer).cq = function (_this__u8e3s4) {
    return this.bq((!(_this__u8e3s4 == null) ? isInterface(_this__u8e3s4, KtMap) : false) ? _this__u8e3s4 : THROW_CCE());
  };
  protoOf(HashMapSerializer).po = function () {
    return HashMap_init_$Create$();
  };
  protoOf(HashMapSerializer).dq = function (_this__u8e3s4) {
    return imul(_this__u8e3s4.j(), 2);
  };
  protoOf(HashMapSerializer).ro = function (_this__u8e3s4) {
    return this.dq(_this__u8e3s4 instanceof HashMap ? _this__u8e3s4 : THROW_CCE());
  };
  protoOf(HashMapSerializer).eq = function (_this__u8e3s4) {
    return _this__u8e3s4;
  };
  protoOf(HashMapSerializer).to = function (_this__u8e3s4) {
    return this.eq(_this__u8e3s4 instanceof HashMap ? _this__u8e3s4 : THROW_CCE());
  };
  protoOf(HashMapSerializer).fq = function (_this__u8e3s4) {
    var tmp0_elvis_lhs = _this__u8e3s4 instanceof HashMap ? _this__u8e3s4 : null;
    return tmp0_elvis_lhs == null ? HashMap_init_$Create$_0(_this__u8e3s4) : tmp0_elvis_lhs;
  };
  protoOf(HashMapSerializer).vo = function (_this__u8e3s4) {
    return this.fq((!(_this__u8e3s4 == null) ? isInterface(_this__u8e3s4, KtMap) : false) ? _this__u8e3s4 : THROW_CCE());
  };
  protoOf(HashMapSerializer).gq = function (_this__u8e3s4, size) {
  };
  protoOf(HashMapSerializer).xo = function (_this__u8e3s4, size) {
    return this.gq(_this__u8e3s4 instanceof HashMap ? _this__u8e3s4 : THROW_CCE(), size);
  };
  function LinkedHashMapSerializer(kSerializer, vSerializer) {
    MapLikeSerializer.call(this, kSerializer, vSerializer);
    this.nq_1 = new LinkedHashMapClassDesc(kSerializer.oi(), vSerializer.oi());
  }
  protoOf(LinkedHashMapSerializer).oi = function () {
    return this.nq_1;
  };
  protoOf(LinkedHashMapSerializer).zp = function (_this__u8e3s4) {
    return _this__u8e3s4.j();
  };
  protoOf(LinkedHashMapSerializer).aq = function (_this__u8e3s4) {
    return this.zp((!(_this__u8e3s4 == null) ? isInterface(_this__u8e3s4, KtMap) : false) ? _this__u8e3s4 : THROW_CCE());
  };
  protoOf(LinkedHashMapSerializer).bq = function (_this__u8e3s4) {
    // Inline function 'kotlin.collections.iterator' call
    return _this__u8e3s4.y1().g();
  };
  protoOf(LinkedHashMapSerializer).cq = function (_this__u8e3s4) {
    return this.bq((!(_this__u8e3s4 == null) ? isInterface(_this__u8e3s4, KtMap) : false) ? _this__u8e3s4 : THROW_CCE());
  };
  protoOf(LinkedHashMapSerializer).po = function () {
    return LinkedHashMap_init_$Create$();
  };
  protoOf(LinkedHashMapSerializer).oq = function (_this__u8e3s4) {
    return imul(_this__u8e3s4.j(), 2);
  };
  protoOf(LinkedHashMapSerializer).ro = function (_this__u8e3s4) {
    return this.oq(_this__u8e3s4 instanceof LinkedHashMap ? _this__u8e3s4 : THROW_CCE());
  };
  protoOf(LinkedHashMapSerializer).pq = function (_this__u8e3s4) {
    return _this__u8e3s4;
  };
  protoOf(LinkedHashMapSerializer).to = function (_this__u8e3s4) {
    return this.pq(_this__u8e3s4 instanceof LinkedHashMap ? _this__u8e3s4 : THROW_CCE());
  };
  protoOf(LinkedHashMapSerializer).fq = function (_this__u8e3s4) {
    var tmp0_elvis_lhs = _this__u8e3s4 instanceof LinkedHashMap ? _this__u8e3s4 : null;
    return tmp0_elvis_lhs == null ? LinkedHashMap_init_$Create$_0(_this__u8e3s4) : tmp0_elvis_lhs;
  };
  protoOf(LinkedHashMapSerializer).vo = function (_this__u8e3s4) {
    return this.fq((!(_this__u8e3s4 == null) ? isInterface(_this__u8e3s4, KtMap) : false) ? _this__u8e3s4 : THROW_CCE());
  };
  protoOf(LinkedHashMapSerializer).qq = function (_this__u8e3s4, size) {
  };
  protoOf(LinkedHashMapSerializer).xo = function (_this__u8e3s4, size) {
    return this.qq(_this__u8e3s4 instanceof LinkedHashMap ? _this__u8e3s4 : THROW_CCE(), size);
  };
  function ReferenceArraySerializer(kClass, eSerializer) {
    CollectionLikeSerializer.call(this, eSerializer);
    this.sq_1 = kClass;
    this.tq_1 = new ArrayClassDesc(eSerializer.oi());
  }
  protoOf(ReferenceArraySerializer).oi = function () {
    return this.tq_1;
  };
  protoOf(ReferenceArraySerializer).uq = function (_this__u8e3s4) {
    return _this__u8e3s4.length;
  };
  protoOf(ReferenceArraySerializer).aq = function (_this__u8e3s4) {
    return this.uq((!(_this__u8e3s4 == null) ? isArray(_this__u8e3s4) : false) ? _this__u8e3s4 : THROW_CCE());
  };
  protoOf(ReferenceArraySerializer).vq = function (_this__u8e3s4) {
    return arrayIterator(_this__u8e3s4);
  };
  protoOf(ReferenceArraySerializer).cq = function (_this__u8e3s4) {
    return this.vq((!(_this__u8e3s4 == null) ? isArray(_this__u8e3s4) : false) ? _this__u8e3s4 : THROW_CCE());
  };
  protoOf(ReferenceArraySerializer).po = function () {
    // Inline function 'kotlin.collections.arrayListOf' call
    return ArrayList_init_$Create$_0();
  };
  protoOf(ReferenceArraySerializer).wq = function (_this__u8e3s4) {
    return _this__u8e3s4.j();
  };
  protoOf(ReferenceArraySerializer).ro = function (_this__u8e3s4) {
    return this.wq(_this__u8e3s4 instanceof ArrayList ? _this__u8e3s4 : THROW_CCE());
  };
  protoOf(ReferenceArraySerializer).xq = function (_this__u8e3s4) {
    return toNativeArrayImpl(_this__u8e3s4, this.sq_1);
  };
  protoOf(ReferenceArraySerializer).to = function (_this__u8e3s4) {
    return this.xq(_this__u8e3s4 instanceof ArrayList ? _this__u8e3s4 : THROW_CCE());
  };
  protoOf(ReferenceArraySerializer).yq = function (_this__u8e3s4) {
    return ArrayList_init_$Create$_1(asList(_this__u8e3s4));
  };
  protoOf(ReferenceArraySerializer).vo = function (_this__u8e3s4) {
    return this.yq((!(_this__u8e3s4 == null) ? isArray(_this__u8e3s4) : false) ? _this__u8e3s4 : THROW_CCE());
  };
  protoOf(ReferenceArraySerializer).zq = function (_this__u8e3s4, size) {
    return _this__u8e3s4.n4(size);
  };
  protoOf(ReferenceArraySerializer).xo = function (_this__u8e3s4, size) {
    return this.zq(_this__u8e3s4 instanceof ArrayList ? _this__u8e3s4 : THROW_CCE(), size);
  };
  protoOf(ReferenceArraySerializer).ar = function (_this__u8e3s4, index, element) {
    _this__u8e3s4.u3(index, element);
  };
  protoOf(ReferenceArraySerializer).zo = function (_this__u8e3s4, index, element) {
    var tmp = _this__u8e3s4 instanceof ArrayList ? _this__u8e3s4 : THROW_CCE();
    return this.ar(tmp, index, (element == null ? true : !(element == null)) ? element : THROW_CCE());
  };
  function CollectionSerializer(element) {
    CollectionLikeSerializer.call(this, element);
  }
  protoOf(CollectionSerializer).bp = function (_this__u8e3s4) {
    return _this__u8e3s4.j();
  };
  protoOf(CollectionSerializer).aq = function (_this__u8e3s4) {
    return this.bp((!(_this__u8e3s4 == null) ? isInterface(_this__u8e3s4, Collection) : false) ? _this__u8e3s4 : THROW_CCE());
  };
  protoOf(CollectionSerializer).cp = function (_this__u8e3s4) {
    return _this__u8e3s4.g();
  };
  protoOf(CollectionSerializer).cq = function (_this__u8e3s4) {
    return this.cp((!(_this__u8e3s4 == null) ? isInterface(_this__u8e3s4, Collection) : false) ? _this__u8e3s4 : THROW_CCE());
  };
  function MapLikeSerializer(keySerializer, valueSerializer) {
    AbstractCollectionSerializer.call(this);
    this.hq_1 = keySerializer;
    this.iq_1 = valueSerializer;
  }
  protoOf(MapLikeSerializer).jq = function (decoder, builder, startIndex, size) {
    // Inline function 'kotlin.require' call
    if (!(size >= 0)) {
      var message = 'Size must be known in advance when using READ_ALL';
      throw IllegalArgumentException_init_$Create$(toString(message));
    }
    var progression = step(until(0, imul(size, 2)), 2);
    var inductionVariable = progression.s_1;
    var last = progression.t_1;
    var step_0 = progression.u_1;
    if (step_0 > 0 && inductionVariable <= last || (step_0 < 0 && last <= inductionVariable))
      do {
        var index = inductionVariable;
        inductionVariable = inductionVariable + step_0 | 0;
        this.kq(decoder, startIndex + index | 0, builder, false);
      }
       while (!(index === last));
  };
  protoOf(MapLikeSerializer).fp = function (decoder, builder, startIndex, size) {
    return this.jq(decoder, (!(builder == null) ? isInterface(builder, KtMutableMap) : false) ? builder : THROW_CCE(), startIndex, size);
  };
  protoOf(MapLikeSerializer).kq = function (decoder, index, builder, checkIndex) {
    var key = decoder.cm(this.oi(), index, this.hq_1);
    var tmp;
    if (checkIndex) {
      // Inline function 'kotlin.also' call
      var this_0 = decoder.gm(this.oi());
      // Inline function 'kotlin.require' call
      if (!(this_0 === (index + 1 | 0))) {
        var message = 'Value must follow key in a map, index for key: ' + index + ', returned index for value: ' + this_0;
        throw IllegalArgumentException_init_$Create$(toString(message));
      }
      tmp = this_0;
    } else {
      tmp = index + 1 | 0;
    }
    var vIndex = tmp;
    var tmp_0;
    var tmp_1;
    if (builder.t1(key)) {
      var tmp_2 = this.iq_1.oi().tj();
      tmp_1 = !(tmp_2 instanceof PrimitiveKind);
    } else {
      tmp_1 = false;
    }
    if (tmp_1) {
      tmp_0 = decoder.bm(this.oi(), vIndex, this.iq_1, getValue(builder, key));
    } else {
      tmp_0 = decoder.cm(this.oi(), vIndex, this.iq_1);
    }
    var value = tmp_0;
    // Inline function 'kotlin.collections.set' call
    builder.c2(key, value);
  };
  protoOf(MapLikeSerializer).gp = function (decoder, index, builder, checkIndex) {
    return this.kq(decoder, index, (!(builder == null) ? isInterface(builder, KtMutableMap) : false) ? builder : THROW_CCE(), checkIndex);
  };
  protoOf(MapLikeSerializer).ep = function (encoder, value) {
    var size = this.aq(value);
    // Inline function 'kotlinx.serialization.encoding.encodeCollection' call
    var descriptor = this.oi();
    var composite = encoder.ln(descriptor, size);
    var iterator = this.cq(value);
    var index = 0;
    // Inline function 'kotlin.collections.forEach' call
    // Inline function 'kotlin.collections.iterator' call
    var _iterator__ex2g4s = iterator;
    while (_iterator__ex2g4s.h()) {
      var element = _iterator__ex2g4s.i();
      // Inline function 'kotlin.collections.component1' call
      var k = element.r1();
      // Inline function 'kotlin.collections.component2' call
      var v = element.s1();
      var tmp = this.oi();
      var _unary__edvuaz = index;
      index = _unary__edvuaz + 1 | 0;
      composite.gn(tmp, _unary__edvuaz, this.hq_1, k);
      var tmp_0 = this.oi();
      var _unary__edvuaz_0 = index;
      index = _unary__edvuaz_0 + 1 | 0;
      composite.gn(tmp_0, _unary__edvuaz_0, this.iq_1, v);
    }
    composite.ql(descriptor);
  };
  protoOf(MapLikeSerializer).pi = function (encoder, value) {
    return this.ep(encoder, (value == null ? true : !(value == null)) ? value : THROW_CCE());
  };
  function CollectionLikeSerializer(elementSerializer) {
    AbstractCollectionSerializer.call(this);
    this.dp_1 = elementSerializer;
  }
  protoOf(CollectionLikeSerializer).ep = function (encoder, value) {
    var size = this.aq(value);
    // Inline function 'kotlinx.serialization.encoding.encodeCollection' call
    var descriptor = this.oi();
    var composite = encoder.ln(descriptor, size);
    var iterator = this.cq(value);
    var inductionVariable = 0;
    if (inductionVariable < size)
      do {
        var index = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        composite.gn(this.oi(), index, this.dp_1, iterator.i());
      }
       while (inductionVariable < size);
    composite.ql(descriptor);
  };
  protoOf(CollectionLikeSerializer).pi = function (encoder, value) {
    return this.ep(encoder, (value == null ? true : !(value == null)) ? value : THROW_CCE());
  };
  protoOf(CollectionLikeSerializer).fp = function (decoder, builder, startIndex, size) {
    // Inline function 'kotlin.require' call
    if (!(size >= 0)) {
      var message = 'Size must be known in advance when using READ_ALL';
      throw IllegalArgumentException_init_$Create$(toString(message));
    }
    var inductionVariable = 0;
    if (inductionVariable < size)
      do {
        var index = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        this.gp(decoder, startIndex + index | 0, builder, false);
      }
       while (inductionVariable < size);
  };
  protoOf(CollectionLikeSerializer).gp = function (decoder, index, builder, checkIndex) {
    this.zo(builder, index, decoder.cm(this.oi(), index, this.dp_1));
  };
  function readSize($this, decoder, builder) {
    var size = decoder.hm($this.oi());
    $this.xo(builder, size);
    return size;
  }
  function AbstractCollectionSerializer() {
  }
  protoOf(AbstractCollectionSerializer).ip = function (decoder, previous) {
    var tmp1_elvis_lhs = previous == null ? null : this.vo(previous);
    var builder = tmp1_elvis_lhs == null ? this.po() : tmp1_elvis_lhs;
    var startIndex = this.ro(builder);
    var compositeDecoder = decoder.pl(this.oi());
    if (compositeDecoder.fm()) {
      this.fp(compositeDecoder, builder, startIndex, readSize(this, compositeDecoder, builder));
    } else {
      $l$loop: while (true) {
        var index = compositeDecoder.gm(this.oi());
        if (index === -1)
          break $l$loop;
        this.hp(compositeDecoder, startIndex + index | 0, builder);
      }
    }
    compositeDecoder.ql(this.oi());
    return this.to(builder);
  };
  protoOf(AbstractCollectionSerializer).qi = function (decoder) {
    return this.ip(decoder, null);
  };
  protoOf(AbstractCollectionSerializer).hp = function (decoder, index, builder, checkIndex, $super) {
    checkIndex = checkIndex === VOID ? true : checkIndex;
    var tmp;
    if ($super === VOID) {
      this.gp(decoder, index, builder, checkIndex);
      tmp = Unit_instance;
    } else {
      tmp = $super.gp.call(this, decoder, index, builder, checkIndex);
    }
    return tmp;
  };
  function PrimitiveArraySerializer(primitiveSerializer) {
    CollectionLikeSerializer.call(this, primitiveSerializer);
    this.cr_1 = new PrimitiveArrayDescriptor(primitiveSerializer.oi());
  }
  protoOf(PrimitiveArraySerializer).oi = function () {
    return this.cr_1;
  };
  protoOf(PrimitiveArraySerializer).dr = function (_this__u8e3s4) {
    return _this__u8e3s4.er();
  };
  protoOf(PrimitiveArraySerializer).ro = function (_this__u8e3s4) {
    return this.dr(_this__u8e3s4 instanceof PrimitiveArrayBuilder ? _this__u8e3s4 : THROW_CCE());
  };
  protoOf(PrimitiveArraySerializer).fr = function (_this__u8e3s4) {
    return _this__u8e3s4.gr();
  };
  protoOf(PrimitiveArraySerializer).to = function (_this__u8e3s4) {
    return this.fr(_this__u8e3s4 instanceof PrimitiveArrayBuilder ? _this__u8e3s4 : THROW_CCE());
  };
  protoOf(PrimitiveArraySerializer).hr = function (_this__u8e3s4, size) {
    return _this__u8e3s4.ir(size);
  };
  protoOf(PrimitiveArraySerializer).xo = function (_this__u8e3s4, size) {
    return this.hr(_this__u8e3s4 instanceof PrimitiveArrayBuilder ? _this__u8e3s4 : THROW_CCE(), size);
  };
  protoOf(PrimitiveArraySerializer).jr = function (_this__u8e3s4) {
    var message = 'This method lead to boxing and must not be used, use writeContents instead';
    throw IllegalStateException_init_$Create$(toString(message));
  };
  protoOf(PrimitiveArraySerializer).cq = function (_this__u8e3s4) {
    return this.jr((_this__u8e3s4 == null ? true : !(_this__u8e3s4 == null)) ? _this__u8e3s4 : THROW_CCE());
  };
  protoOf(PrimitiveArraySerializer).kr = function (_this__u8e3s4, index, element) {
    var message = 'This method lead to boxing and must not be used, use Builder.append instead';
    throw IllegalStateException_init_$Create$(toString(message));
  };
  protoOf(PrimitiveArraySerializer).zo = function (_this__u8e3s4, index, element) {
    var tmp = _this__u8e3s4 instanceof PrimitiveArrayBuilder ? _this__u8e3s4 : THROW_CCE();
    return this.kr(tmp, index, (element == null ? true : !(element == null)) ? element : THROW_CCE());
  };
  protoOf(PrimitiveArraySerializer).po = function () {
    return this.vo(this.lr());
  };
  protoOf(PrimitiveArraySerializer).or = function (encoder, value) {
    var size = this.aq(value);
    // Inline function 'kotlinx.serialization.encoding.encodeCollection' call
    var descriptor = this.cr_1;
    var composite = encoder.ln(descriptor, size);
    this.nr(composite, value, size);
    composite.ql(descriptor);
  };
  protoOf(PrimitiveArraySerializer).pi = function (encoder, value) {
    return this.or(encoder, (value == null ? true : !(value == null)) ? value : THROW_CCE());
  };
  protoOf(PrimitiveArraySerializer).ep = function (encoder, value) {
    return this.or(encoder, (value == null ? true : !(value == null)) ? value : THROW_CCE());
  };
  protoOf(PrimitiveArraySerializer).qi = function (decoder) {
    return this.ip(decoder, null);
  };
  function PrimitiveArrayBuilder() {
  }
  protoOf(PrimitiveArrayBuilder).pr = function (requiredCapacity, $super) {
    requiredCapacity = requiredCapacity === VOID ? this.er() + 1 | 0 : requiredCapacity;
    var tmp;
    if ($super === VOID) {
      this.ir(requiredCapacity);
      tmp = Unit_instance;
    } else {
      tmp = $super.ir.call(this, requiredCapacity);
    }
    return tmp;
  };
  function Companion() {
    Companion_instance_0 = this;
    this.qr_1 = longArray(0);
  }
  var Companion_instance_0;
  function Companion_getInstance_7() {
    if (Companion_instance_0 == null)
      new Companion();
    return Companion_instance_0;
  }
  function prepareHighMarksArray($this, elementsCount) {
    var slotsCount = (elementsCount - 1 | 0) >>> 6 | 0;
    var elementsInLastSlot = elementsCount & 63;
    var highMarks = longArray(slotsCount);
    if (!(elementsInLastSlot === 0)) {
      highMarks[get_lastIndex(highMarks)] = (new Long(-1, -1)).r2(elementsCount);
    }
    return highMarks;
  }
  function markHigh($this, index) {
    var slot = (index >>> 6 | 0) - 1 | 0;
    var offsetInSlot = index & 63;
    $this.ur_1[slot] = $this.ur_1[slot].v2((new Long(1, 0)).r2(offsetInSlot));
  }
  function nextUnmarkedHighIndex($this) {
    var inductionVariable = 0;
    var last = $this.ur_1.length - 1 | 0;
    if (inductionVariable <= last)
      do {
        var slot = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        var slotOffset = imul(slot + 1 | 0, 64);
        var slotMarks = $this.ur_1[slot];
        while (!slotMarks.equals(new Long(-1, -1))) {
          var indexInSlot = countTrailingZeroBits(slotMarks.q2());
          slotMarks = slotMarks.v2((new Long(1, 0)).r2(indexInSlot));
          var index = slotOffset + indexInSlot | 0;
          if ($this.sr_1($this.rr_1, index)) {
            $this.ur_1[slot] = slotMarks;
            return index;
          }
        }
        $this.ur_1[slot] = slotMarks;
      }
       while (inductionVariable <= last);
    return -1;
  }
  function ElementMarker(descriptor, readIfAbsent) {
    Companion_getInstance_7();
    this.rr_1 = descriptor;
    this.sr_1 = readIfAbsent;
    var elementsCount = this.rr_1.vj();
    if (elementsCount <= 64) {
      var tmp = this;
      var tmp_0;
      if (elementsCount === 64) {
        tmp_0 = new Long(0, 0);
      } else {
        tmp_0 = (new Long(-1, -1)).r2(elementsCount);
      }
      tmp.tr_1 = tmp_0;
      this.ur_1 = Companion_getInstance_7().qr_1;
    } else {
      this.tr_1 = new Long(0, 0);
      this.ur_1 = prepareHighMarksArray(this, elementsCount);
    }
  }
  protoOf(ElementMarker).vr = function (index) {
    if (index < 64) {
      this.tr_1 = this.tr_1.v2((new Long(1, 0)).r2(index));
    } else {
      markHigh(this, index);
    }
  };
  protoOf(ElementMarker).wr = function () {
    var elementsCount = this.rr_1.vj();
    while (!this.tr_1.equals(new Long(-1, -1))) {
      var index = countTrailingZeroBits(this.tr_1.q2());
      this.tr_1 = this.tr_1.v2((new Long(1, 0)).r2(index));
      if (this.sr_1(this.rr_1, index)) {
        return index;
      }
    }
    if (elementsCount > 64) {
      return nextUnmarkedHighIndex(this);
    }
    return -1;
  };
  function createSimpleEnumSerializer(serialName, values) {
    return new EnumSerializer(serialName, values);
  }
  function createUnmarkedDescriptor($this, serialName) {
    var d = new EnumDescriptor(serialName, $this.xr_1.length);
    // Inline function 'kotlin.collections.forEach' call
    var indexedObject = $this.xr_1;
    var inductionVariable = 0;
    var last = indexedObject.length;
    while (inductionVariable < last) {
      var element = indexedObject[inductionVariable];
      inductionVariable = inductionVariable + 1 | 0;
      d.ms(element.d2_1);
    }
    return d;
  }
  function EnumSerializer$descriptor$delegate$lambda(this$0, $serialName) {
    return function () {
      var tmp0_elvis_lhs = this$0.yr_1;
      return tmp0_elvis_lhs == null ? createUnmarkedDescriptor(this$0, $serialName) : tmp0_elvis_lhs;
    };
  }
  function EnumSerializer(serialName, values) {
    this.xr_1 = values;
    this.yr_1 = null;
    var tmp = this;
    tmp.zr_1 = lazy_0(EnumSerializer$descriptor$delegate$lambda(this, serialName));
  }
  protoOf(EnumSerializer).oi = function () {
    var tmp0 = this.zr_1;
    // Inline function 'kotlin.getValue' call
    descriptor$factory_1();
    return tmp0.s1();
  };
  protoOf(EnumSerializer).ns = function (encoder, value) {
    var index = indexOf(this.xr_1, value);
    if (index === -1) {
      throw SerializationException_init_$Create$_0(toString(value) + ' is not a valid enum ' + this.oi().sj() + ', ' + ('must be one of ' + contentToString(this.xr_1)));
    }
    encoder.um(this.oi(), index);
  };
  protoOf(EnumSerializer).pi = function (encoder, value) {
    return this.ns(encoder, value instanceof Enum ? value : THROW_CCE());
  };
  protoOf(EnumSerializer).qi = function (decoder) {
    var index = decoder.ll(this.oi());
    if (!(0 <= index ? index <= (this.xr_1.length - 1 | 0) : false)) {
      throw SerializationException_init_$Create$_0('' + index + ' is not among valid ' + this.oi().sj() + ' enum values, ' + ('values size is ' + this.xr_1.length));
    }
    return this.xr_1[index];
  };
  protoOf(EnumSerializer).toString = function () {
    return 'kotlinx.serialization.internal.EnumSerializer<' + this.oi().sj() + '>';
  };
  function _get_elementDescriptors__y23q9p($this) {
    var tmp0 = $this.bt_1;
    // Inline function 'kotlin.getValue' call
    elementDescriptors$factory();
    return tmp0.s1();
  }
  function EnumDescriptor$elementDescriptors$delegate$lambda($elementsCount, $name, this$0) {
    return function () {
      var tmp = 0;
      var tmp_0 = $elementsCount;
      // Inline function 'kotlin.arrayOfNulls' call
      var tmp_1 = Array(tmp_0);
      while (tmp < tmp_0) {
        var tmp_2 = tmp;
        tmp_1[tmp_2] = buildSerialDescriptor($name + '.' + this$0.xj(tmp_2), OBJECT_getInstance(), []);
        tmp = tmp + 1 | 0;
      }
      return tmp_1;
    };
  }
  function EnumDescriptor(name, elementsCount) {
    PluginGeneratedSerialDescriptor.call(this, name, VOID, elementsCount);
    this.at_1 = ENUM_getInstance();
    var tmp = this;
    tmp.bt_1 = lazy_0(EnumDescriptor$elementDescriptors$delegate$lambda(elementsCount, name, this));
  }
  protoOf(EnumDescriptor).tj = function () {
    return this.at_1;
  };
  protoOf(EnumDescriptor).ak = function (index) {
    return getChecked(_get_elementDescriptors__y23q9p(this), index);
  };
  protoOf(EnumDescriptor).equals = function (other) {
    if (this === other)
      return true;
    if (other == null)
      return false;
    if (!(!(other == null) ? isInterface(other, SerialDescriptor) : false))
      return false;
    if (!(other.tj() === ENUM_getInstance()))
      return false;
    if (!(this.sj() === other.sj()))
      return false;
    if (!equals(cachedSerialNames(this), cachedSerialNames(other)))
      return false;
    return true;
  };
  protoOf(EnumDescriptor).toString = function () {
    return joinToString(get_elementNames(this), ', ', this.sj() + '(', ')');
  };
  protoOf(EnumDescriptor).hashCode = function () {
    var result = getStringHashCode(this.sj());
    // Inline function 'kotlinx.serialization.internal.elementsHashCodeBy' call
    // Inline function 'kotlin.collections.fold' call
    var accumulator = 1;
    var _iterator__ex2g4s = get_elementNames(this).g();
    while (_iterator__ex2g4s.h()) {
      var element = _iterator__ex2g4s.i();
      var hash = accumulator;
      var tmp = imul(31, hash);
      // Inline function 'kotlin.hashCode' call
      var tmp1_elvis_lhs = element == null ? null : hashCode(element);
      accumulator = tmp + (tmp1_elvis_lhs == null ? 0 : tmp1_elvis_lhs) | 0;
    }
    var elementsHashCode = accumulator;
    result = imul(31, result) + elementsHashCode | 0;
    return result;
  };
  function descriptor$factory_1() {
    return getPropertyCallableRef('descriptor', 1, KProperty1, function (receiver) {
      return receiver.oi();
    }, null);
  }
  function elementDescriptors$factory() {
    return getPropertyCallableRef('elementDescriptors', 1, KProperty1, function (receiver) {
      return _get_elementDescriptors__y23q9p(receiver);
    }, null);
  }
  function InlinePrimitiveDescriptor(name, primitiveSerializer) {
    return new InlineClassDescriptor(name, new InlinePrimitiveDescriptor$1(primitiveSerializer));
  }
  function InlineClassDescriptor(name, generatedSerializer) {
    PluginGeneratedSerialDescriptor.call(this, name, generatedSerializer, 1);
    this.qt_1 = true;
  }
  protoOf(InlineClassDescriptor).uj = function () {
    return this.qt_1;
  };
  protoOf(InlineClassDescriptor).hashCode = function () {
    return imul(protoOf(PluginGeneratedSerialDescriptor).hashCode.call(this), 31);
  };
  protoOf(InlineClassDescriptor).equals = function (other) {
    var tmp$ret$0;
    $l$block_5: {
      // Inline function 'kotlinx.serialization.internal.equalsImpl' call
      if (this === other) {
        tmp$ret$0 = true;
        break $l$block_5;
      }
      if (!(other instanceof InlineClassDescriptor)) {
        tmp$ret$0 = false;
        break $l$block_5;
      }
      if (!(this.sj() === other.sj())) {
        tmp$ret$0 = false;
        break $l$block_5;
      }
      if (!(other.qt_1 && contentEquals(this.ct(), other.ct()))) {
        tmp$ret$0 = false;
        break $l$block_5;
      }
      if (!(this.vj() === other.vj())) {
        tmp$ret$0 = false;
        break $l$block_5;
      }
      var inductionVariable = 0;
      var last = this.vj();
      if (inductionVariable < last)
        do {
          var index = inductionVariable;
          inductionVariable = inductionVariable + 1 | 0;
          if (!(this.ak(index).sj() === other.ak(index).sj())) {
            tmp$ret$0 = false;
            break $l$block_5;
          }
          if (!equals(this.ak(index).tj(), other.ak(index).tj())) {
            tmp$ret$0 = false;
            break $l$block_5;
          }
        }
         while (inductionVariable < last);
      tmp$ret$0 = true;
    }
    return tmp$ret$0;
  };
  function InlinePrimitiveDescriptor$1($primitiveSerializer) {
    this.rt_1 = $primitiveSerializer;
  }
  protoOf(InlinePrimitiveDescriptor$1).st = function () {
    // Inline function 'kotlin.arrayOf' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    return [this.rt_1];
  };
  protoOf(InlinePrimitiveDescriptor$1).oi = function () {
    var message = 'unsupported';
    throw IllegalStateException_init_$Create$(toString(message));
  };
  protoOf(InlinePrimitiveDescriptor$1).pi = function (encoder, value) {
    // Inline function 'kotlin.error' call
    var message = 'unsupported';
    throw IllegalStateException_init_$Create$(toString(message));
  };
  protoOf(InlinePrimitiveDescriptor$1).qi = function (decoder) {
    // Inline function 'kotlin.error' call
    var message = 'unsupported';
    throw IllegalStateException_init_$Create$(toString(message));
  };
  function jsonCachedSerialNames(_this__u8e3s4) {
    return cachedSerialNames(_this__u8e3s4);
  }
  function NoOpEncoder() {
    NoOpEncoder_instance = this;
    AbstractEncoder.call(this);
    this.ut_1 = EmptySerializersModule_0();
  }
  protoOf(NoOpEncoder).em = function () {
    return this.ut_1;
  };
  protoOf(NoOpEncoder).jm = function (value) {
    return Unit_instance;
  };
  protoOf(NoOpEncoder).km = function () {
    return Unit_instance;
  };
  protoOf(NoOpEncoder).lm = function (value) {
    return Unit_instance;
  };
  protoOf(NoOpEncoder).mm = function (value) {
    return Unit_instance;
  };
  protoOf(NoOpEncoder).nm = function (value) {
    return Unit_instance;
  };
  protoOf(NoOpEncoder).om = function (value) {
    return Unit_instance;
  };
  protoOf(NoOpEncoder).pm = function (value) {
    return Unit_instance;
  };
  protoOf(NoOpEncoder).qm = function (value) {
    return Unit_instance;
  };
  protoOf(NoOpEncoder).rm = function (value) {
    return Unit_instance;
  };
  protoOf(NoOpEncoder).sm = function (value) {
    return Unit_instance;
  };
  protoOf(NoOpEncoder).tm = function (value) {
    return Unit_instance;
  };
  protoOf(NoOpEncoder).um = function (enumDescriptor, index) {
    return Unit_instance;
  };
  var NoOpEncoder_instance;
  function NoOpEncoder_getInstance() {
    if (NoOpEncoder_instance == null)
      new NoOpEncoder();
    return NoOpEncoder_instance;
  }
  function error($this) {
    throw IllegalStateException_init_$Create$('Descriptor for type `kotlin.Nothing` does not have elements');
  }
  function NothingSerialDescriptor() {
    NothingSerialDescriptor_instance = this;
    this.vt_1 = OBJECT_getInstance();
    this.wt_1 = 'kotlin.Nothing';
  }
  protoOf(NothingSerialDescriptor).tj = function () {
    return this.vt_1;
  };
  protoOf(NothingSerialDescriptor).sj = function () {
    return this.wt_1;
  };
  protoOf(NothingSerialDescriptor).vj = function () {
    return 0;
  };
  protoOf(NothingSerialDescriptor).xj = function (index) {
    error(this);
  };
  protoOf(NothingSerialDescriptor).yj = function (name) {
    error(this);
  };
  protoOf(NothingSerialDescriptor).bk = function (index) {
    error(this);
  };
  protoOf(NothingSerialDescriptor).ak = function (index) {
    error(this);
  };
  protoOf(NothingSerialDescriptor).zj = function (index) {
    error(this);
  };
  protoOf(NothingSerialDescriptor).toString = function () {
    return 'NothingSerialDescriptor';
  };
  protoOf(NothingSerialDescriptor).equals = function (other) {
    return this === other;
  };
  protoOf(NothingSerialDescriptor).hashCode = function () {
    return getStringHashCode(this.wt_1) + imul(31, this.vt_1.hashCode()) | 0;
  };
  var NothingSerialDescriptor_instance;
  function NothingSerialDescriptor_getInstance() {
    if (NothingSerialDescriptor_instance == null)
      new NothingSerialDescriptor();
    return NothingSerialDescriptor_instance;
  }
  function NullableSerializer(serializer) {
    this.xt_1 = serializer;
    this.yt_1 = new SerialDescriptorForNullable(this.xt_1.oi());
  }
  protoOf(NullableSerializer).oi = function () {
    return this.yt_1;
  };
  protoOf(NullableSerializer).zt = function (encoder, value) {
    if (!(value == null)) {
      encoder.kn();
      encoder.hn(this.xt_1, value);
    } else {
      encoder.km();
    }
  };
  protoOf(NullableSerializer).pi = function (encoder, value) {
    return this.zt(encoder, (value == null ? true : !(value == null)) ? value : THROW_CCE());
  };
  protoOf(NullableSerializer).qi = function (decoder) {
    return decoder.al() ? decoder.ol(this.xt_1) : decoder.bl();
  };
  protoOf(NullableSerializer).equals = function (other) {
    if (this === other)
      return true;
    if (other == null || !getKClassFromExpression(this).equals(getKClassFromExpression(other)))
      return false;
    if (!(other instanceof NullableSerializer))
      THROW_CCE();
    if (!equals(this.xt_1, other.xt_1))
      return false;
    return true;
  };
  protoOf(NullableSerializer).hashCode = function () {
    return hashCode(this.xt_1);
  };
  function SerialDescriptorForNullable(original) {
    this.ck_1 = original;
    this.dk_1 = this.ck_1.sj() + '?';
    this.ek_1 = cachedSerialNames(this.ck_1);
  }
  protoOf(SerialDescriptorForNullable).sj = function () {
    return this.dk_1;
  };
  protoOf(SerialDescriptorForNullable).yk = function () {
    return this.ek_1;
  };
  protoOf(SerialDescriptorForNullable).oj = function () {
    return true;
  };
  protoOf(SerialDescriptorForNullable).equals = function (other) {
    if (this === other)
      return true;
    if (!(other instanceof SerialDescriptorForNullable))
      return false;
    if (!equals(this.ck_1, other.ck_1))
      return false;
    return true;
  };
  protoOf(SerialDescriptorForNullable).toString = function () {
    return toString(this.ck_1) + '?';
  };
  protoOf(SerialDescriptorForNullable).hashCode = function () {
    return imul(hashCode(this.ck_1), 31);
  };
  protoOf(SerialDescriptorForNullable).tj = function () {
    return this.ck_1.tj();
  };
  protoOf(SerialDescriptorForNullable).uj = function () {
    return this.ck_1.uj();
  };
  protoOf(SerialDescriptorForNullable).vj = function () {
    return this.ck_1.vj();
  };
  protoOf(SerialDescriptorForNullable).wj = function () {
    return this.ck_1.wj();
  };
  protoOf(SerialDescriptorForNullable).xj = function (index) {
    return this.ck_1.xj(index);
  };
  protoOf(SerialDescriptorForNullable).yj = function (name) {
    return this.ck_1.yj(name);
  };
  protoOf(SerialDescriptorForNullable).zj = function (index) {
    return this.ck_1.zj(index);
  };
  protoOf(SerialDescriptorForNullable).ak = function (index) {
    return this.ck_1.ak(index);
  };
  protoOf(SerialDescriptorForNullable).bk = function (index) {
    return this.ck_1.bk(index);
  };
  function ObjectSerializer$descriptor$delegate$lambda$lambda(this$0) {
    return function ($this$buildSerialDescriptor) {
      $this$buildSerialDescriptor.ti_1 = this$0.bu_1;
      return Unit_instance;
    };
  }
  function ObjectSerializer$descriptor$delegate$lambda($serialName, this$0) {
    return function () {
      var tmp = OBJECT_getInstance();
      return buildSerialDescriptor($serialName, tmp, [], ObjectSerializer$descriptor$delegate$lambda$lambda(this$0));
    };
  }
  function ObjectSerializer(serialName, objectInstance) {
    this.au_1 = objectInstance;
    this.bu_1 = emptyList();
    var tmp = this;
    var tmp_0 = LazyThreadSafetyMode_PUBLICATION_getInstance();
    tmp.cu_1 = lazy(tmp_0, ObjectSerializer$descriptor$delegate$lambda(serialName, this));
  }
  protoOf(ObjectSerializer).oi = function () {
    var tmp0 = this.cu_1;
    // Inline function 'kotlin.getValue' call
    descriptor$factory_2();
    return tmp0.s1();
  };
  protoOf(ObjectSerializer).ej = function (encoder, value) {
    encoder.pl(this.oi()).ql(this.oi());
  };
  protoOf(ObjectSerializer).pi = function (encoder, value) {
    return this.ej(encoder, !(value == null) ? value : THROW_CCE());
  };
  protoOf(ObjectSerializer).qi = function (decoder) {
    // Inline function 'kotlinx.serialization.encoding.decodeStructure' call
    var descriptor = this.oi();
    var composite = decoder.pl(descriptor);
    var tmp$ret$0;
    $l$block_0: {
      if (composite.fm()) {
        tmp$ret$0 = Unit_instance;
        break $l$block_0;
      }
      var index = composite.gm(this.oi());
      if (index === -1) {
        tmp$ret$0 = Unit_instance;
        break $l$block_0;
      } else
        throw SerializationException_init_$Create$_0('Unexpected index ' + index);
    }
    var result = tmp$ret$0;
    composite.ql(descriptor);
    return this.au_1;
  };
  function descriptor$factory_2() {
    return getPropertyCallableRef('descriptor', 1, KProperty1, function (receiver) {
      return receiver.oi();
    }, null);
  }
  function get_EMPTY_DESCRIPTOR_ARRAY() {
    _init_properties_Platform_common_kt__3qzecs();
    return EMPTY_DESCRIPTOR_ARRAY;
  }
  var EMPTY_DESCRIPTOR_ARRAY;
  function cachedSerialNames(_this__u8e3s4) {
    _init_properties_Platform_common_kt__3qzecs();
    if (isInterface(_this__u8e3s4, CachedNames))
      return _this__u8e3s4.yk();
    var result = HashSet_init_$Create$_1(_this__u8e3s4.vj());
    var inductionVariable = 0;
    var last = _this__u8e3s4.vj();
    if (inductionVariable < last)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        // Inline function 'kotlin.collections.plusAssign' call
        var element = _this__u8e3s4.xj(i);
        result.e(element);
      }
       while (inductionVariable < last);
    return result;
  }
  function kclass(_this__u8e3s4) {
    _init_properties_Platform_common_kt__3qzecs();
    var t = _this__u8e3s4.n9();
    var tmp;
    if (!(t == null) ? isInterface(t, KClass) : false) {
      tmp = t;
    } else {
      if (!(t == null) ? isInterface(t, KTypeParameter) : false) {
        throw IllegalArgumentException_init_$Create$('Captured type parameter ' + toString(t) + ' from generic non-reified function. ' + ('Such functionality cannot be supported because ' + toString(t) + ' is erased, either specify serializer explicitly or make ') + ('calling function inline with reified ' + toString(t) + '.'));
      } else {
        throw IllegalArgumentException_init_$Create$('Only KClass supported as classifier, got ' + toString_0(t));
      }
    }
    var tmp_0 = tmp;
    return isInterface(tmp_0, KClass) ? tmp_0 : THROW_CCE();
  }
  function typeOrThrow(_this__u8e3s4) {
    _init_properties_Platform_common_kt__3qzecs();
    var tmp0 = _this__u8e3s4.he_1;
    var tmp$ret$1;
    $l$block: {
      // Inline function 'kotlin.requireNotNull' call
      if (tmp0 == null) {
        var message = 'Star projections in type arguments are not allowed, but had ' + toString_0(_this__u8e3s4.he_1);
        throw IllegalArgumentException_init_$Create$(toString(message));
      } else {
        tmp$ret$1 = tmp0;
        break $l$block;
      }
    }
    return tmp$ret$1;
  }
  function notRegisteredMessage(_this__u8e3s4) {
    _init_properties_Platform_common_kt__3qzecs();
    var tmp0_elvis_lhs = _this__u8e3s4.z8();
    return notRegisteredMessage_0(tmp0_elvis_lhs == null ? '<local class name not available>' : tmp0_elvis_lhs);
  }
  function compactArray(_this__u8e3s4) {
    _init_properties_Platform_common_kt__3qzecs();
    // Inline function 'kotlin.takeUnless' call
    var tmp;
    // Inline function 'kotlin.collections.isNullOrEmpty' call
    if (!(_this__u8e3s4 == null || _this__u8e3s4.p())) {
      tmp = _this__u8e3s4;
    } else {
      tmp = null;
    }
    var tmp0_safe_receiver = tmp;
    var tmp_0;
    if (tmp0_safe_receiver == null) {
      tmp_0 = null;
    } else {
      // Inline function 'kotlin.collections.toTypedArray' call
      tmp_0 = copyToArray(tmp0_safe_receiver);
    }
    var tmp1_elvis_lhs = tmp_0;
    return tmp1_elvis_lhs == null ? get_EMPTY_DESCRIPTOR_ARRAY() : tmp1_elvis_lhs;
  }
  function notRegisteredMessage_0(className) {
    _init_properties_Platform_common_kt__3qzecs();
    return "Serializer for class '" + className + "' is not found.\n" + "Please ensure that class is marked as '@Serializable' and that the serialization compiler plugin is applied.\n";
  }
  var properties_initialized_Platform_common_kt_i7q4ty;
  function _init_properties_Platform_common_kt__3qzecs() {
    if (!properties_initialized_Platform_common_kt_i7q4ty) {
      properties_initialized_Platform_common_kt_i7q4ty = true;
      // Inline function 'kotlin.arrayOf' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      EMPTY_DESCRIPTOR_ARRAY = [];
    }
  }
  function throwMissingFieldException(seen, goldenMask, descriptor) {
    // Inline function 'kotlin.collections.mutableListOf' call
    var missingFields = ArrayList_init_$Create$_0();
    var missingFieldsBits = goldenMask & ~seen;
    var inductionVariable = 0;
    if (inductionVariable < 32)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        if (!((missingFieldsBits & 1) === 0)) {
          // Inline function 'kotlin.collections.plusAssign' call
          var element = descriptor.xj(i);
          missingFields.e(element);
        }
        missingFieldsBits = missingFieldsBits >>> 1 | 0;
      }
       while (inductionVariable < 32);
    throw MissingFieldException_init_$Create$(missingFields, descriptor.sj());
  }
  function hashCodeImpl(_this__u8e3s4, typeParams) {
    var result = getStringHashCode(_this__u8e3s4.sj());
    result = imul(31, result) + contentHashCode(typeParams) | 0;
    var elementDescriptors = get_elementDescriptors(_this__u8e3s4);
    // Inline function 'kotlinx.serialization.internal.elementsHashCodeBy' call
    // Inline function 'kotlin.collections.fold' call
    var accumulator = 1;
    var _iterator__ex2g4s = elementDescriptors.g();
    while (_iterator__ex2g4s.h()) {
      var element = _iterator__ex2g4s.i();
      var hash = accumulator;
      var tmp = imul(31, hash);
      // Inline function 'kotlin.hashCode' call
      var tmp0_safe_receiver = element.sj();
      var tmp1_elvis_lhs = tmp0_safe_receiver == null ? null : hashCode(tmp0_safe_receiver);
      accumulator = tmp + (tmp1_elvis_lhs == null ? 0 : tmp1_elvis_lhs) | 0;
    }
    var namesHash = accumulator;
    // Inline function 'kotlinx.serialization.internal.elementsHashCodeBy' call
    // Inline function 'kotlin.collections.fold' call
    var accumulator_0 = 1;
    var _iterator__ex2g4s_0 = elementDescriptors.g();
    while (_iterator__ex2g4s_0.h()) {
      var element_0 = _iterator__ex2g4s_0.i();
      var hash_0 = accumulator_0;
      var tmp_0 = imul(31, hash_0);
      // Inline function 'kotlin.hashCode' call
      var tmp0_safe_receiver_0 = element_0.tj();
      var tmp1_elvis_lhs_0 = tmp0_safe_receiver_0 == null ? null : hashCode(tmp0_safe_receiver_0);
      accumulator_0 = tmp_0 + (tmp1_elvis_lhs_0 == null ? 0 : tmp1_elvis_lhs_0) | 0;
    }
    var kindHash = accumulator_0;
    result = imul(31, result) + namesHash | 0;
    result = imul(31, result) + kindHash | 0;
    return result;
  }
  function _get_childSerializers__7vnyfa($this) {
    var tmp0 = $this.js_1;
    // Inline function 'kotlin.getValue' call
    childSerializers$factory();
    return tmp0.s1();
  }
  function _get__hashCode__tgwhef_0($this) {
    var tmp0 = $this.ls_1;
    // Inline function 'kotlin.getValue' call
    _hashCode$factory_0();
    return tmp0.s1();
  }
  function buildIndices($this) {
    var indices = HashMap_init_$Create$();
    var inductionVariable = 0;
    var last = $this.es_1.length - 1 | 0;
    if (inductionVariable <= last)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        // Inline function 'kotlin.collections.set' call
        var key = $this.es_1[i];
        indices.c2(key, i);
      }
       while (inductionVariable <= last);
    return indices;
  }
  function PluginGeneratedSerialDescriptor$childSerializers$delegate$lambda(this$0) {
    return function () {
      var tmp0_safe_receiver = this$0.bs_1;
      var tmp1_elvis_lhs = tmp0_safe_receiver == null ? null : tmp0_safe_receiver.st();
      return tmp1_elvis_lhs == null ? get_EMPTY_SERIALIZER_ARRAY() : tmp1_elvis_lhs;
    };
  }
  function PluginGeneratedSerialDescriptor$typeParameterDescriptors$delegate$lambda(this$0) {
    return function () {
      var tmp0_safe_receiver = this$0.bs_1;
      var tmp1_safe_receiver = tmp0_safe_receiver == null ? null : tmp0_safe_receiver.tt();
      var tmp;
      if (tmp1_safe_receiver == null) {
        tmp = null;
      } else {
        // Inline function 'kotlin.collections.map' call
        // Inline function 'kotlin.collections.mapTo' call
        var destination = ArrayList_init_$Create$(tmp1_safe_receiver.length);
        var inductionVariable = 0;
        var last = tmp1_safe_receiver.length;
        while (inductionVariable < last) {
          var item = tmp1_safe_receiver[inductionVariable];
          inductionVariable = inductionVariable + 1 | 0;
          var tmp$ret$0 = item.oi();
          destination.e(tmp$ret$0);
        }
        tmp = destination;
      }
      return compactArray(tmp);
    };
  }
  function PluginGeneratedSerialDescriptor$_hashCode$delegate$lambda(this$0) {
    return function () {
      return hashCodeImpl(this$0, this$0.ct());
    };
  }
  function PluginGeneratedSerialDescriptor$toString$lambda(this$0) {
    return function (i) {
      return this$0.xj(i) + ': ' + this$0.ak(i).sj();
    };
  }
  function PluginGeneratedSerialDescriptor(serialName, generatedSerializer, elementsCount) {
    generatedSerializer = generatedSerializer === VOID ? null : generatedSerializer;
    this.as_1 = serialName;
    this.bs_1 = generatedSerializer;
    this.cs_1 = elementsCount;
    this.ds_1 = -1;
    var tmp = this;
    var tmp_0 = 0;
    var tmp_1 = this.cs_1;
    // Inline function 'kotlin.arrayOfNulls' call
    var tmp_2 = Array(tmp_1);
    while (tmp_0 < tmp_1) {
      tmp_2[tmp_0] = '[UNINITIALIZED]';
      tmp_0 = tmp_0 + 1 | 0;
    }
    tmp.es_1 = tmp_2;
    var tmp_3 = this;
    // Inline function 'kotlin.arrayOfNulls' call
    var size = this.cs_1;
    tmp_3.fs_1 = Array(size);
    this.gs_1 = null;
    this.hs_1 = booleanArray(this.cs_1);
    this.is_1 = emptyMap();
    var tmp_4 = this;
    var tmp_5 = LazyThreadSafetyMode_PUBLICATION_getInstance();
    tmp_4.js_1 = lazy(tmp_5, PluginGeneratedSerialDescriptor$childSerializers$delegate$lambda(this));
    var tmp_6 = this;
    var tmp_7 = LazyThreadSafetyMode_PUBLICATION_getInstance();
    tmp_6.ks_1 = lazy(tmp_7, PluginGeneratedSerialDescriptor$typeParameterDescriptors$delegate$lambda(this));
    var tmp_8 = this;
    var tmp_9 = LazyThreadSafetyMode_PUBLICATION_getInstance();
    tmp_8.ls_1 = lazy(tmp_9, PluginGeneratedSerialDescriptor$_hashCode$delegate$lambda(this));
  }
  protoOf(PluginGeneratedSerialDescriptor).sj = function () {
    return this.as_1;
  };
  protoOf(PluginGeneratedSerialDescriptor).vj = function () {
    return this.cs_1;
  };
  protoOf(PluginGeneratedSerialDescriptor).tj = function () {
    return CLASS_getInstance();
  };
  protoOf(PluginGeneratedSerialDescriptor).wj = function () {
    var tmp0_elvis_lhs = this.gs_1;
    return tmp0_elvis_lhs == null ? emptyList() : tmp0_elvis_lhs;
  };
  protoOf(PluginGeneratedSerialDescriptor).yk = function () {
    return this.is_1.w1();
  };
  protoOf(PluginGeneratedSerialDescriptor).ct = function () {
    var tmp0 = this.ks_1;
    // Inline function 'kotlin.getValue' call
    typeParameterDescriptors$factory();
    return tmp0.s1();
  };
  protoOf(PluginGeneratedSerialDescriptor).dt = function (name, isOptional) {
    this.ds_1 = this.ds_1 + 1 | 0;
    this.es_1[this.ds_1] = name;
    this.hs_1[this.ds_1] = isOptional;
    this.fs_1[this.ds_1] = null;
    if (this.ds_1 === (this.cs_1 - 1 | 0)) {
      this.is_1 = buildIndices(this);
    }
  };
  protoOf(PluginGeneratedSerialDescriptor).ms = function (name, isOptional, $super) {
    isOptional = isOptional === VOID ? false : isOptional;
    var tmp;
    if ($super === VOID) {
      this.dt(name, isOptional);
      tmp = Unit_instance;
    } else {
      tmp = $super.dt.call(this, name, isOptional);
    }
    return tmp;
  };
  protoOf(PluginGeneratedSerialDescriptor).ak = function (index) {
    return getChecked(_get_childSerializers__7vnyfa(this), index).oi();
  };
  protoOf(PluginGeneratedSerialDescriptor).bk = function (index) {
    return getChecked_0(this.hs_1, index);
  };
  protoOf(PluginGeneratedSerialDescriptor).zj = function (index) {
    var tmp0_elvis_lhs = getChecked(this.fs_1, index);
    return tmp0_elvis_lhs == null ? emptyList() : tmp0_elvis_lhs;
  };
  protoOf(PluginGeneratedSerialDescriptor).xj = function (index) {
    return getChecked(this.es_1, index);
  };
  protoOf(PluginGeneratedSerialDescriptor).yj = function (name) {
    var tmp0_elvis_lhs = this.is_1.v1(name);
    return tmp0_elvis_lhs == null ? -3 : tmp0_elvis_lhs;
  };
  protoOf(PluginGeneratedSerialDescriptor).equals = function (other) {
    var tmp$ret$0;
    $l$block_5: {
      // Inline function 'kotlinx.serialization.internal.equalsImpl' call
      if (this === other) {
        tmp$ret$0 = true;
        break $l$block_5;
      }
      if (!(other instanceof PluginGeneratedSerialDescriptor)) {
        tmp$ret$0 = false;
        break $l$block_5;
      }
      if (!(this.sj() === other.sj())) {
        tmp$ret$0 = false;
        break $l$block_5;
      }
      if (!contentEquals(this.ct(), other.ct())) {
        tmp$ret$0 = false;
        break $l$block_5;
      }
      if (!(this.vj() === other.vj())) {
        tmp$ret$0 = false;
        break $l$block_5;
      }
      var inductionVariable = 0;
      var last = this.vj();
      if (inductionVariable < last)
        do {
          var index = inductionVariable;
          inductionVariable = inductionVariable + 1 | 0;
          if (!(this.ak(index).sj() === other.ak(index).sj())) {
            tmp$ret$0 = false;
            break $l$block_5;
          }
          if (!equals(this.ak(index).tj(), other.ak(index).tj())) {
            tmp$ret$0 = false;
            break $l$block_5;
          }
        }
         while (inductionVariable < last);
      tmp$ret$0 = true;
    }
    return tmp$ret$0;
  };
  protoOf(PluginGeneratedSerialDescriptor).hashCode = function () {
    return _get__hashCode__tgwhef_0(this);
  };
  protoOf(PluginGeneratedSerialDescriptor).toString = function () {
    var tmp = until(0, this.cs_1);
    var tmp_0 = this.sj() + '(';
    return joinToString(tmp, ', ', tmp_0, ')', VOID, VOID, PluginGeneratedSerialDescriptor$toString$lambda(this));
  };
  function childSerializers$factory() {
    return getPropertyCallableRef('childSerializers', 1, KProperty1, function (receiver) {
      return _get_childSerializers__7vnyfa(receiver);
    }, null);
  }
  function typeParameterDescriptors$factory() {
    return getPropertyCallableRef('typeParameterDescriptors', 1, KProperty1, function (receiver) {
      return receiver.ct();
    }, null);
  }
  function _hashCode$factory_0() {
    return getPropertyCallableRef('_hashCode', 1, KProperty1, function (receiver) {
      return _get__hashCode__tgwhef_0(receiver);
    }, null);
  }
  function get_EMPTY_SERIALIZER_ARRAY() {
    _init_properties_PluginHelperInterfaces_kt__xgvzfp();
    return EMPTY_SERIALIZER_ARRAY;
  }
  var EMPTY_SERIALIZER_ARRAY;
  function SerializerFactory() {
  }
  function GeneratedSerializer() {
  }
  var properties_initialized_PluginHelperInterfaces_kt_ap8in1;
  function _init_properties_PluginHelperInterfaces_kt__xgvzfp() {
    if (!properties_initialized_PluginHelperInterfaces_kt_ap8in1) {
      properties_initialized_PluginHelperInterfaces_kt_ap8in1 = true;
      // Inline function 'kotlin.arrayOf' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      EMPTY_SERIALIZER_ARRAY = [];
    }
  }
  function CharArraySerializer_0() {
    CharArraySerializer_instance = this;
    PrimitiveArraySerializer.call(this, serializer_1(Companion_getInstance_1()));
  }
  protoOf(CharArraySerializer_0).gu = function (_this__u8e3s4) {
    return _this__u8e3s4.length;
  };
  protoOf(CharArraySerializer_0).aq = function (_this__u8e3s4) {
    return this.gu((!(_this__u8e3s4 == null) ? isCharArray(_this__u8e3s4) : false) ? _this__u8e3s4 : THROW_CCE());
  };
  protoOf(CharArraySerializer_0).hu = function (_this__u8e3s4) {
    return new CharArrayBuilder(_this__u8e3s4);
  };
  protoOf(CharArraySerializer_0).vo = function (_this__u8e3s4) {
    return this.hu((!(_this__u8e3s4 == null) ? isCharArray(_this__u8e3s4) : false) ? _this__u8e3s4 : THROW_CCE());
  };
  protoOf(CharArraySerializer_0).lr = function () {
    return charArray(0);
  };
  protoOf(CharArraySerializer_0).iu = function (decoder, index, builder, checkIndex) {
    builder.lu(decoder.yl(this.cr_1, index));
  };
  protoOf(CharArraySerializer_0).gp = function (decoder, index, builder, checkIndex) {
    return this.iu(decoder, index, builder instanceof CharArrayBuilder ? builder : THROW_CCE(), checkIndex);
  };
  protoOf(CharArraySerializer_0).mr = function (decoder, index, builder, checkIndex) {
    return this.iu(decoder, index, builder instanceof CharArrayBuilder ? builder : THROW_CCE(), checkIndex);
  };
  protoOf(CharArraySerializer_0).mu = function (encoder, content, size) {
    var inductionVariable = 0;
    if (inductionVariable < size)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        encoder.dn(this.cr_1, i, content[i]);
      }
       while (inductionVariable < size);
  };
  protoOf(CharArraySerializer_0).nr = function (encoder, content, size) {
    return this.mu(encoder, (!(content == null) ? isCharArray(content) : false) ? content : THROW_CCE(), size);
  };
  var CharArraySerializer_instance;
  function CharArraySerializer_getInstance() {
    if (CharArraySerializer_instance == null)
      new CharArraySerializer_0();
    return CharArraySerializer_instance;
  }
  function DoubleArraySerializer_0() {
    DoubleArraySerializer_instance = this;
    PrimitiveArraySerializer.call(this, serializer_2(DoubleCompanionObject_instance));
  }
  protoOf(DoubleArraySerializer_0).pu = function (_this__u8e3s4) {
    return _this__u8e3s4.length;
  };
  protoOf(DoubleArraySerializer_0).aq = function (_this__u8e3s4) {
    return this.pu((!(_this__u8e3s4 == null) ? isDoubleArray(_this__u8e3s4) : false) ? _this__u8e3s4 : THROW_CCE());
  };
  protoOf(DoubleArraySerializer_0).qu = function (_this__u8e3s4) {
    return new DoubleArrayBuilder(_this__u8e3s4);
  };
  protoOf(DoubleArraySerializer_0).vo = function (_this__u8e3s4) {
    return this.qu((!(_this__u8e3s4 == null) ? isDoubleArray(_this__u8e3s4) : false) ? _this__u8e3s4 : THROW_CCE());
  };
  protoOf(DoubleArraySerializer_0).lr = function () {
    return new Float64Array(0);
  };
  protoOf(DoubleArraySerializer_0).ru = function (decoder, index, builder, checkIndex) {
    builder.uu(decoder.xl(this.cr_1, index));
  };
  protoOf(DoubleArraySerializer_0).gp = function (decoder, index, builder, checkIndex) {
    return this.ru(decoder, index, builder instanceof DoubleArrayBuilder ? builder : THROW_CCE(), checkIndex);
  };
  protoOf(DoubleArraySerializer_0).mr = function (decoder, index, builder, checkIndex) {
    return this.ru(decoder, index, builder instanceof DoubleArrayBuilder ? builder : THROW_CCE(), checkIndex);
  };
  protoOf(DoubleArraySerializer_0).vu = function (encoder, content, size) {
    var inductionVariable = 0;
    if (inductionVariable < size)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        encoder.cn(this.cr_1, i, content[i]);
      }
       while (inductionVariable < size);
  };
  protoOf(DoubleArraySerializer_0).nr = function (encoder, content, size) {
    return this.vu(encoder, (!(content == null) ? isDoubleArray(content) : false) ? content : THROW_CCE(), size);
  };
  var DoubleArraySerializer_instance;
  function DoubleArraySerializer_getInstance() {
    if (DoubleArraySerializer_instance == null)
      new DoubleArraySerializer_0();
    return DoubleArraySerializer_instance;
  }
  function FloatArraySerializer_0() {
    FloatArraySerializer_instance = this;
    PrimitiveArraySerializer.call(this, serializer_3(FloatCompanionObject_instance));
  }
  protoOf(FloatArraySerializer_0).yu = function (_this__u8e3s4) {
    return _this__u8e3s4.length;
  };
  protoOf(FloatArraySerializer_0).aq = function (_this__u8e3s4) {
    return this.yu((!(_this__u8e3s4 == null) ? isFloatArray(_this__u8e3s4) : false) ? _this__u8e3s4 : THROW_CCE());
  };
  protoOf(FloatArraySerializer_0).zu = function (_this__u8e3s4) {
    return new FloatArrayBuilder(_this__u8e3s4);
  };
  protoOf(FloatArraySerializer_0).vo = function (_this__u8e3s4) {
    return this.zu((!(_this__u8e3s4 == null) ? isFloatArray(_this__u8e3s4) : false) ? _this__u8e3s4 : THROW_CCE());
  };
  protoOf(FloatArraySerializer_0).lr = function () {
    return new Float32Array(0);
  };
  protoOf(FloatArraySerializer_0).av = function (decoder, index, builder, checkIndex) {
    builder.dv(decoder.wl(this.cr_1, index));
  };
  protoOf(FloatArraySerializer_0).gp = function (decoder, index, builder, checkIndex) {
    return this.av(decoder, index, builder instanceof FloatArrayBuilder ? builder : THROW_CCE(), checkIndex);
  };
  protoOf(FloatArraySerializer_0).mr = function (decoder, index, builder, checkIndex) {
    return this.av(decoder, index, builder instanceof FloatArrayBuilder ? builder : THROW_CCE(), checkIndex);
  };
  protoOf(FloatArraySerializer_0).ev = function (encoder, content, size) {
    var inductionVariable = 0;
    if (inductionVariable < size)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        encoder.bn(this.cr_1, i, content[i]);
      }
       while (inductionVariable < size);
  };
  protoOf(FloatArraySerializer_0).nr = function (encoder, content, size) {
    return this.ev(encoder, (!(content == null) ? isFloatArray(content) : false) ? content : THROW_CCE(), size);
  };
  var FloatArraySerializer_instance;
  function FloatArraySerializer_getInstance() {
    if (FloatArraySerializer_instance == null)
      new FloatArraySerializer_0();
    return FloatArraySerializer_instance;
  }
  function LongArraySerializer_0() {
    LongArraySerializer_instance = this;
    PrimitiveArraySerializer.call(this, serializer_4(Companion_getInstance_2()));
  }
  protoOf(LongArraySerializer_0).hv = function (_this__u8e3s4) {
    return _this__u8e3s4.length;
  };
  protoOf(LongArraySerializer_0).aq = function (_this__u8e3s4) {
    return this.hv((!(_this__u8e3s4 == null) ? isLongArray(_this__u8e3s4) : false) ? _this__u8e3s4 : THROW_CCE());
  };
  protoOf(LongArraySerializer_0).iv = function (_this__u8e3s4) {
    return new LongArrayBuilder(_this__u8e3s4);
  };
  protoOf(LongArraySerializer_0).vo = function (_this__u8e3s4) {
    return this.iv((!(_this__u8e3s4 == null) ? isLongArray(_this__u8e3s4) : false) ? _this__u8e3s4 : THROW_CCE());
  };
  protoOf(LongArraySerializer_0).lr = function () {
    return longArray(0);
  };
  protoOf(LongArraySerializer_0).jv = function (decoder, index, builder, checkIndex) {
    builder.mv(decoder.vl(this.cr_1, index));
  };
  protoOf(LongArraySerializer_0).gp = function (decoder, index, builder, checkIndex) {
    return this.jv(decoder, index, builder instanceof LongArrayBuilder ? builder : THROW_CCE(), checkIndex);
  };
  protoOf(LongArraySerializer_0).mr = function (decoder, index, builder, checkIndex) {
    return this.jv(decoder, index, builder instanceof LongArrayBuilder ? builder : THROW_CCE(), checkIndex);
  };
  protoOf(LongArraySerializer_0).nv = function (encoder, content, size) {
    var inductionVariable = 0;
    if (inductionVariable < size)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        encoder.an(this.cr_1, i, content[i]);
      }
       while (inductionVariable < size);
  };
  protoOf(LongArraySerializer_0).nr = function (encoder, content, size) {
    return this.nv(encoder, (!(content == null) ? isLongArray(content) : false) ? content : THROW_CCE(), size);
  };
  var LongArraySerializer_instance;
  function LongArraySerializer_getInstance() {
    if (LongArraySerializer_instance == null)
      new LongArraySerializer_0();
    return LongArraySerializer_instance;
  }
  function ULongArraySerializer_0() {
    ULongArraySerializer_instance = this;
    PrimitiveArraySerializer.call(this, serializer_5(Companion_getInstance_3()));
  }
  protoOf(ULongArraySerializer_0).qv = function (_this__u8e3s4) {
    return _ULongArray___get_size__impl__ju6dtr(_this__u8e3s4);
  };
  protoOf(ULongArraySerializer_0).aq = function (_this__u8e3s4) {
    return this.qv(_this__u8e3s4 instanceof ULongArray ? _this__u8e3s4.di_1 : THROW_CCE());
  };
  protoOf(ULongArraySerializer_0).rv = function (_this__u8e3s4) {
    return new ULongArrayBuilder(_this__u8e3s4);
  };
  protoOf(ULongArraySerializer_0).vo = function (_this__u8e3s4) {
    return this.rv(_this__u8e3s4 instanceof ULongArray ? _this__u8e3s4.di_1 : THROW_CCE());
  };
  protoOf(ULongArraySerializer_0).sv = function () {
    return _ULongArray___init__impl__twm1l3(0);
  };
  protoOf(ULongArraySerializer_0).lr = function () {
    return new ULongArray(this.sv());
  };
  protoOf(ULongArraySerializer_0).tv = function (decoder, index, builder, checkIndex) {
    // Inline function 'kotlin.toULong' call
    var this_0 = decoder.am(this.cr_1, index).gl();
    var tmp$ret$0 = _ULong___init__impl__c78o9k(this_0);
    builder.wv(tmp$ret$0);
  };
  protoOf(ULongArraySerializer_0).gp = function (decoder, index, builder, checkIndex) {
    return this.tv(decoder, index, builder instanceof ULongArrayBuilder ? builder : THROW_CCE(), checkIndex);
  };
  protoOf(ULongArraySerializer_0).mr = function (decoder, index, builder, checkIndex) {
    return this.tv(decoder, index, builder instanceof ULongArrayBuilder ? builder : THROW_CCE(), checkIndex);
  };
  protoOf(ULongArraySerializer_0).xv = function (encoder, content, size) {
    var inductionVariable = 0;
    if (inductionVariable < size)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        var tmp = encoder.fn(this.cr_1, i);
        // Inline function 'kotlin.ULong.toLong' call
        var this_0 = ULongArray__get_impl_pr71q9(content, i);
        var tmp$ret$0 = _ULong___get_data__impl__fggpzb(this_0);
        tmp.pm(tmp$ret$0);
      }
       while (inductionVariable < size);
  };
  protoOf(ULongArraySerializer_0).nr = function (encoder, content, size) {
    return this.xv(encoder, content instanceof ULongArray ? content.di_1 : THROW_CCE(), size);
  };
  var ULongArraySerializer_instance;
  function ULongArraySerializer_getInstance() {
    if (ULongArraySerializer_instance == null)
      new ULongArraySerializer_0();
    return ULongArraySerializer_instance;
  }
  function IntArraySerializer_0() {
    IntArraySerializer_instance = this;
    PrimitiveArraySerializer.call(this, serializer_6(IntCompanionObject_instance));
  }
  protoOf(IntArraySerializer_0).aw = function (_this__u8e3s4) {
    return _this__u8e3s4.length;
  };
  protoOf(IntArraySerializer_0).aq = function (_this__u8e3s4) {
    return this.aw((!(_this__u8e3s4 == null) ? isIntArray(_this__u8e3s4) : false) ? _this__u8e3s4 : THROW_CCE());
  };
  protoOf(IntArraySerializer_0).bw = function (_this__u8e3s4) {
    return new IntArrayBuilder(_this__u8e3s4);
  };
  protoOf(IntArraySerializer_0).vo = function (_this__u8e3s4) {
    return this.bw((!(_this__u8e3s4 == null) ? isIntArray(_this__u8e3s4) : false) ? _this__u8e3s4 : THROW_CCE());
  };
  protoOf(IntArraySerializer_0).lr = function () {
    return new Int32Array(0);
  };
  protoOf(IntArraySerializer_0).cw = function (decoder, index, builder, checkIndex) {
    builder.fw(decoder.ul(this.cr_1, index));
  };
  protoOf(IntArraySerializer_0).gp = function (decoder, index, builder, checkIndex) {
    return this.cw(decoder, index, builder instanceof IntArrayBuilder ? builder : THROW_CCE(), checkIndex);
  };
  protoOf(IntArraySerializer_0).mr = function (decoder, index, builder, checkIndex) {
    return this.cw(decoder, index, builder instanceof IntArrayBuilder ? builder : THROW_CCE(), checkIndex);
  };
  protoOf(IntArraySerializer_0).gw = function (encoder, content, size) {
    var inductionVariable = 0;
    if (inductionVariable < size)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        encoder.zm(this.cr_1, i, content[i]);
      }
       while (inductionVariable < size);
  };
  protoOf(IntArraySerializer_0).nr = function (encoder, content, size) {
    return this.gw(encoder, (!(content == null) ? isIntArray(content) : false) ? content : THROW_CCE(), size);
  };
  var IntArraySerializer_instance;
  function IntArraySerializer_getInstance() {
    if (IntArraySerializer_instance == null)
      new IntArraySerializer_0();
    return IntArraySerializer_instance;
  }
  function UIntArraySerializer_0() {
    UIntArraySerializer_instance = this;
    PrimitiveArraySerializer.call(this, serializer_7(Companion_getInstance_4()));
  }
  protoOf(UIntArraySerializer_0).jw = function (_this__u8e3s4) {
    return _UIntArray___get_size__impl__r6l8ci(_this__u8e3s4);
  };
  protoOf(UIntArraySerializer_0).aq = function (_this__u8e3s4) {
    return this.jw(_this__u8e3s4 instanceof UIntArray ? _this__u8e3s4.th_1 : THROW_CCE());
  };
  protoOf(UIntArraySerializer_0).kw = function (_this__u8e3s4) {
    return new UIntArrayBuilder(_this__u8e3s4);
  };
  protoOf(UIntArraySerializer_0).vo = function (_this__u8e3s4) {
    return this.kw(_this__u8e3s4 instanceof UIntArray ? _this__u8e3s4.th_1 : THROW_CCE());
  };
  protoOf(UIntArraySerializer_0).lw = function () {
    return _UIntArray___init__impl__ghjpc6(0);
  };
  protoOf(UIntArraySerializer_0).lr = function () {
    return new UIntArray(this.lw());
  };
  protoOf(UIntArraySerializer_0).mw = function (decoder, index, builder, checkIndex) {
    // Inline function 'kotlin.toUInt' call
    var this_0 = decoder.am(this.cr_1, index).fl();
    var tmp$ret$0 = _UInt___init__impl__l7qpdl(this_0);
    builder.pw(tmp$ret$0);
  };
  protoOf(UIntArraySerializer_0).gp = function (decoder, index, builder, checkIndex) {
    return this.mw(decoder, index, builder instanceof UIntArrayBuilder ? builder : THROW_CCE(), checkIndex);
  };
  protoOf(UIntArraySerializer_0).mr = function (decoder, index, builder, checkIndex) {
    return this.mw(decoder, index, builder instanceof UIntArrayBuilder ? builder : THROW_CCE(), checkIndex);
  };
  protoOf(UIntArraySerializer_0).qw = function (encoder, content, size) {
    var inductionVariable = 0;
    if (inductionVariable < size)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        var tmp = encoder.fn(this.cr_1, i);
        // Inline function 'kotlin.UInt.toInt' call
        var this_0 = UIntArray__get_impl_gp5kza(content, i);
        var tmp$ret$0 = _UInt___get_data__impl__f0vqqw(this_0);
        tmp.om(tmp$ret$0);
      }
       while (inductionVariable < size);
  };
  protoOf(UIntArraySerializer_0).nr = function (encoder, content, size) {
    return this.qw(encoder, content instanceof UIntArray ? content.th_1 : THROW_CCE(), size);
  };
  var UIntArraySerializer_instance;
  function UIntArraySerializer_getInstance() {
    if (UIntArraySerializer_instance == null)
      new UIntArraySerializer_0();
    return UIntArraySerializer_instance;
  }
  function ShortArraySerializer_0() {
    ShortArraySerializer_instance = this;
    PrimitiveArraySerializer.call(this, serializer_8(ShortCompanionObject_instance));
  }
  protoOf(ShortArraySerializer_0).tw = function (_this__u8e3s4) {
    return _this__u8e3s4.length;
  };
  protoOf(ShortArraySerializer_0).aq = function (_this__u8e3s4) {
    return this.tw((!(_this__u8e3s4 == null) ? isShortArray(_this__u8e3s4) : false) ? _this__u8e3s4 : THROW_CCE());
  };
  protoOf(ShortArraySerializer_0).uw = function (_this__u8e3s4) {
    return new ShortArrayBuilder(_this__u8e3s4);
  };
  protoOf(ShortArraySerializer_0).vo = function (_this__u8e3s4) {
    return this.uw((!(_this__u8e3s4 == null) ? isShortArray(_this__u8e3s4) : false) ? _this__u8e3s4 : THROW_CCE());
  };
  protoOf(ShortArraySerializer_0).lr = function () {
    return new Int16Array(0);
  };
  protoOf(ShortArraySerializer_0).vw = function (decoder, index, builder, checkIndex) {
    builder.yw(decoder.tl(this.cr_1, index));
  };
  protoOf(ShortArraySerializer_0).gp = function (decoder, index, builder, checkIndex) {
    return this.vw(decoder, index, builder instanceof ShortArrayBuilder ? builder : THROW_CCE(), checkIndex);
  };
  protoOf(ShortArraySerializer_0).mr = function (decoder, index, builder, checkIndex) {
    return this.vw(decoder, index, builder instanceof ShortArrayBuilder ? builder : THROW_CCE(), checkIndex);
  };
  protoOf(ShortArraySerializer_0).zw = function (encoder, content, size) {
    var inductionVariable = 0;
    if (inductionVariable < size)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        encoder.ym(this.cr_1, i, content[i]);
      }
       while (inductionVariable < size);
  };
  protoOf(ShortArraySerializer_0).nr = function (encoder, content, size) {
    return this.zw(encoder, (!(content == null) ? isShortArray(content) : false) ? content : THROW_CCE(), size);
  };
  var ShortArraySerializer_instance;
  function ShortArraySerializer_getInstance() {
    if (ShortArraySerializer_instance == null)
      new ShortArraySerializer_0();
    return ShortArraySerializer_instance;
  }
  function UShortArraySerializer_0() {
    UShortArraySerializer_instance = this;
    PrimitiveArraySerializer.call(this, serializer_9(Companion_getInstance_5()));
  }
  protoOf(UShortArraySerializer_0).cx = function (_this__u8e3s4) {
    return _UShortArray___get_size__impl__jqto1b(_this__u8e3s4);
  };
  protoOf(UShortArraySerializer_0).aq = function (_this__u8e3s4) {
    return this.cx(_this__u8e3s4 instanceof UShortArray ? _this__u8e3s4.ni_1 : THROW_CCE());
  };
  protoOf(UShortArraySerializer_0).dx = function (_this__u8e3s4) {
    return new UShortArrayBuilder(_this__u8e3s4);
  };
  protoOf(UShortArraySerializer_0).vo = function (_this__u8e3s4) {
    return this.dx(_this__u8e3s4 instanceof UShortArray ? _this__u8e3s4.ni_1 : THROW_CCE());
  };
  protoOf(UShortArraySerializer_0).ex = function () {
    return _UShortArray___init__impl__9b26ef(0);
  };
  protoOf(UShortArraySerializer_0).lr = function () {
    return new UShortArray(this.ex());
  };
  protoOf(UShortArraySerializer_0).fx = function (decoder, index, builder, checkIndex) {
    // Inline function 'kotlin.toUShort' call
    var this_0 = decoder.am(this.cr_1, index).el();
    var tmp$ret$0 = _UShort___init__impl__jigrne(this_0);
    builder.ix(tmp$ret$0);
  };
  protoOf(UShortArraySerializer_0).gp = function (decoder, index, builder, checkIndex) {
    return this.fx(decoder, index, builder instanceof UShortArrayBuilder ? builder : THROW_CCE(), checkIndex);
  };
  protoOf(UShortArraySerializer_0).mr = function (decoder, index, builder, checkIndex) {
    return this.fx(decoder, index, builder instanceof UShortArrayBuilder ? builder : THROW_CCE(), checkIndex);
  };
  protoOf(UShortArraySerializer_0).jx = function (encoder, content, size) {
    var inductionVariable = 0;
    if (inductionVariable < size)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        var tmp = encoder.fn(this.cr_1, i);
        // Inline function 'kotlin.UShort.toShort' call
        var this_0 = UShortArray__get_impl_fnbhmx(content, i);
        var tmp$ret$0 = _UShort___get_data__impl__g0245(this_0);
        tmp.nm(tmp$ret$0);
      }
       while (inductionVariable < size);
  };
  protoOf(UShortArraySerializer_0).nr = function (encoder, content, size) {
    return this.jx(encoder, content instanceof UShortArray ? content.ni_1 : THROW_CCE(), size);
  };
  var UShortArraySerializer_instance;
  function UShortArraySerializer_getInstance() {
    if (UShortArraySerializer_instance == null)
      new UShortArraySerializer_0();
    return UShortArraySerializer_instance;
  }
  function ByteArraySerializer_0() {
    ByteArraySerializer_instance = this;
    PrimitiveArraySerializer.call(this, serializer_10(ByteCompanionObject_instance));
  }
  protoOf(ByteArraySerializer_0).mx = function (_this__u8e3s4) {
    return _this__u8e3s4.length;
  };
  protoOf(ByteArraySerializer_0).aq = function (_this__u8e3s4) {
    return this.mx((!(_this__u8e3s4 == null) ? isByteArray(_this__u8e3s4) : false) ? _this__u8e3s4 : THROW_CCE());
  };
  protoOf(ByteArraySerializer_0).nx = function (_this__u8e3s4) {
    return new ByteArrayBuilder(_this__u8e3s4);
  };
  protoOf(ByteArraySerializer_0).vo = function (_this__u8e3s4) {
    return this.nx((!(_this__u8e3s4 == null) ? isByteArray(_this__u8e3s4) : false) ? _this__u8e3s4 : THROW_CCE());
  };
  protoOf(ByteArraySerializer_0).lr = function () {
    return new Int8Array(0);
  };
  protoOf(ByteArraySerializer_0).ox = function (decoder, index, builder, checkIndex) {
    builder.rx(decoder.sl(this.cr_1, index));
  };
  protoOf(ByteArraySerializer_0).gp = function (decoder, index, builder, checkIndex) {
    return this.ox(decoder, index, builder instanceof ByteArrayBuilder ? builder : THROW_CCE(), checkIndex);
  };
  protoOf(ByteArraySerializer_0).mr = function (decoder, index, builder, checkIndex) {
    return this.ox(decoder, index, builder instanceof ByteArrayBuilder ? builder : THROW_CCE(), checkIndex);
  };
  protoOf(ByteArraySerializer_0).sx = function (encoder, content, size) {
    var inductionVariable = 0;
    if (inductionVariable < size)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        encoder.xm(this.cr_1, i, content[i]);
      }
       while (inductionVariable < size);
  };
  protoOf(ByteArraySerializer_0).nr = function (encoder, content, size) {
    return this.sx(encoder, (!(content == null) ? isByteArray(content) : false) ? content : THROW_CCE(), size);
  };
  var ByteArraySerializer_instance;
  function ByteArraySerializer_getInstance() {
    if (ByteArraySerializer_instance == null)
      new ByteArraySerializer_0();
    return ByteArraySerializer_instance;
  }
  function UByteArraySerializer_0() {
    UByteArraySerializer_instance = this;
    PrimitiveArraySerializer.call(this, serializer_11(Companion_getInstance_6()));
  }
  protoOf(UByteArraySerializer_0).vx = function (_this__u8e3s4) {
    return _UByteArray___get_size__impl__h6pkdv(_this__u8e3s4);
  };
  protoOf(UByteArraySerializer_0).aq = function (_this__u8e3s4) {
    return this.vx(_this__u8e3s4 instanceof UByteArray ? _this__u8e3s4.jh_1 : THROW_CCE());
  };
  protoOf(UByteArraySerializer_0).wx = function (_this__u8e3s4) {
    return new UByteArrayBuilder(_this__u8e3s4);
  };
  protoOf(UByteArraySerializer_0).vo = function (_this__u8e3s4) {
    return this.wx(_this__u8e3s4 instanceof UByteArray ? _this__u8e3s4.jh_1 : THROW_CCE());
  };
  protoOf(UByteArraySerializer_0).xx = function () {
    return _UByteArray___init__impl__ip4y9n(0);
  };
  protoOf(UByteArraySerializer_0).lr = function () {
    return new UByteArray(this.xx());
  };
  protoOf(UByteArraySerializer_0).yx = function (decoder, index, builder, checkIndex) {
    // Inline function 'kotlin.toUByte' call
    var this_0 = decoder.am(this.cr_1, index).dl();
    var tmp$ret$0 = _UByte___init__impl__g9hnc4(this_0);
    builder.by(tmp$ret$0);
  };
  protoOf(UByteArraySerializer_0).gp = function (decoder, index, builder, checkIndex) {
    return this.yx(decoder, index, builder instanceof UByteArrayBuilder ? builder : THROW_CCE(), checkIndex);
  };
  protoOf(UByteArraySerializer_0).mr = function (decoder, index, builder, checkIndex) {
    return this.yx(decoder, index, builder instanceof UByteArrayBuilder ? builder : THROW_CCE(), checkIndex);
  };
  protoOf(UByteArraySerializer_0).cy = function (encoder, content, size) {
    var inductionVariable = 0;
    if (inductionVariable < size)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        var tmp = encoder.fn(this.cr_1, i);
        // Inline function 'kotlin.UByte.toByte' call
        var this_0 = UByteArray__get_impl_t5f3hv(content, i);
        var tmp$ret$0 = _UByte___get_data__impl__jof9qr(this_0);
        tmp.mm(tmp$ret$0);
      }
       while (inductionVariable < size);
  };
  protoOf(UByteArraySerializer_0).nr = function (encoder, content, size) {
    return this.cy(encoder, content instanceof UByteArray ? content.jh_1 : THROW_CCE(), size);
  };
  var UByteArraySerializer_instance;
  function UByteArraySerializer_getInstance() {
    if (UByteArraySerializer_instance == null)
      new UByteArraySerializer_0();
    return UByteArraySerializer_instance;
  }
  function BooleanArraySerializer_0() {
    BooleanArraySerializer_instance = this;
    PrimitiveArraySerializer.call(this, serializer_12(BooleanCompanionObject_instance));
  }
  protoOf(BooleanArraySerializer_0).fy = function (_this__u8e3s4) {
    return _this__u8e3s4.length;
  };
  protoOf(BooleanArraySerializer_0).aq = function (_this__u8e3s4) {
    return this.fy((!(_this__u8e3s4 == null) ? isBooleanArray(_this__u8e3s4) : false) ? _this__u8e3s4 : THROW_CCE());
  };
  protoOf(BooleanArraySerializer_0).gy = function (_this__u8e3s4) {
    return new BooleanArrayBuilder(_this__u8e3s4);
  };
  protoOf(BooleanArraySerializer_0).vo = function (_this__u8e3s4) {
    return this.gy((!(_this__u8e3s4 == null) ? isBooleanArray(_this__u8e3s4) : false) ? _this__u8e3s4 : THROW_CCE());
  };
  protoOf(BooleanArraySerializer_0).lr = function () {
    return booleanArray(0);
  };
  protoOf(BooleanArraySerializer_0).hy = function (decoder, index, builder, checkIndex) {
    builder.ky(decoder.rl(this.cr_1, index));
  };
  protoOf(BooleanArraySerializer_0).gp = function (decoder, index, builder, checkIndex) {
    return this.hy(decoder, index, builder instanceof BooleanArrayBuilder ? builder : THROW_CCE(), checkIndex);
  };
  protoOf(BooleanArraySerializer_0).mr = function (decoder, index, builder, checkIndex) {
    return this.hy(decoder, index, builder instanceof BooleanArrayBuilder ? builder : THROW_CCE(), checkIndex);
  };
  protoOf(BooleanArraySerializer_0).ly = function (encoder, content, size) {
    var inductionVariable = 0;
    if (inductionVariable < size)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        encoder.wm(this.cr_1, i, content[i]);
      }
       while (inductionVariable < size);
  };
  protoOf(BooleanArraySerializer_0).nr = function (encoder, content, size) {
    return this.ly(encoder, (!(content == null) ? isBooleanArray(content) : false) ? content : THROW_CCE(), size);
  };
  var BooleanArraySerializer_instance;
  function BooleanArraySerializer_getInstance() {
    if (BooleanArraySerializer_instance == null)
      new BooleanArraySerializer_0();
    return BooleanArraySerializer_instance;
  }
  function CharArrayBuilder(bufferWithData) {
    PrimitiveArrayBuilder.call(this);
    this.ju_1 = bufferWithData;
    this.ku_1 = bufferWithData.length;
    this.ir(10);
  }
  protoOf(CharArrayBuilder).er = function () {
    return this.ku_1;
  };
  protoOf(CharArrayBuilder).ir = function (requiredCapacity) {
    if (this.ju_1.length < requiredCapacity)
      this.ju_1 = copyOf(this.ju_1, coerceAtLeast(requiredCapacity, imul(this.ju_1.length, 2)));
  };
  protoOf(CharArrayBuilder).lu = function (c) {
    this.pr();
    var tmp = this.ju_1;
    var _unary__edvuaz = this.ku_1;
    this.ku_1 = _unary__edvuaz + 1 | 0;
    tmp[_unary__edvuaz] = c;
  };
  protoOf(CharArrayBuilder).gr = function () {
    return copyOf(this.ju_1, this.ku_1);
  };
  function DoubleArrayBuilder(bufferWithData) {
    PrimitiveArrayBuilder.call(this);
    this.su_1 = bufferWithData;
    this.tu_1 = bufferWithData.length;
    this.ir(10);
  }
  protoOf(DoubleArrayBuilder).er = function () {
    return this.tu_1;
  };
  protoOf(DoubleArrayBuilder).ir = function (requiredCapacity) {
    if (this.su_1.length < requiredCapacity)
      this.su_1 = copyOf_0(this.su_1, coerceAtLeast(requiredCapacity, imul(this.su_1.length, 2)));
  };
  protoOf(DoubleArrayBuilder).uu = function (c) {
    this.pr();
    var tmp = this.su_1;
    var _unary__edvuaz = this.tu_1;
    this.tu_1 = _unary__edvuaz + 1 | 0;
    tmp[_unary__edvuaz] = c;
  };
  protoOf(DoubleArrayBuilder).gr = function () {
    return copyOf_0(this.su_1, this.tu_1);
  };
  function FloatArrayBuilder(bufferWithData) {
    PrimitiveArrayBuilder.call(this);
    this.bv_1 = bufferWithData;
    this.cv_1 = bufferWithData.length;
    this.ir(10);
  }
  protoOf(FloatArrayBuilder).er = function () {
    return this.cv_1;
  };
  protoOf(FloatArrayBuilder).ir = function (requiredCapacity) {
    if (this.bv_1.length < requiredCapacity)
      this.bv_1 = copyOf_1(this.bv_1, coerceAtLeast(requiredCapacity, imul(this.bv_1.length, 2)));
  };
  protoOf(FloatArrayBuilder).dv = function (c) {
    this.pr();
    var tmp = this.bv_1;
    var _unary__edvuaz = this.cv_1;
    this.cv_1 = _unary__edvuaz + 1 | 0;
    tmp[_unary__edvuaz] = c;
  };
  protoOf(FloatArrayBuilder).gr = function () {
    return copyOf_1(this.bv_1, this.cv_1);
  };
  function LongArrayBuilder(bufferWithData) {
    PrimitiveArrayBuilder.call(this);
    this.kv_1 = bufferWithData;
    this.lv_1 = bufferWithData.length;
    this.ir(10);
  }
  protoOf(LongArrayBuilder).er = function () {
    return this.lv_1;
  };
  protoOf(LongArrayBuilder).ir = function (requiredCapacity) {
    if (this.kv_1.length < requiredCapacity)
      this.kv_1 = copyOf_2(this.kv_1, coerceAtLeast(requiredCapacity, imul(this.kv_1.length, 2)));
  };
  protoOf(LongArrayBuilder).mv = function (c) {
    this.pr();
    var tmp = this.kv_1;
    var _unary__edvuaz = this.lv_1;
    this.lv_1 = _unary__edvuaz + 1 | 0;
    tmp[_unary__edvuaz] = c;
  };
  protoOf(LongArrayBuilder).gr = function () {
    return copyOf_2(this.kv_1, this.lv_1);
  };
  function ULongArrayBuilder(bufferWithData) {
    PrimitiveArrayBuilder.call(this);
    this.uv_1 = bufferWithData;
    this.vv_1 = _ULongArray___get_size__impl__ju6dtr(bufferWithData);
    this.ir(10);
  }
  protoOf(ULongArrayBuilder).er = function () {
    return this.vv_1;
  };
  protoOf(ULongArrayBuilder).ir = function (requiredCapacity) {
    if (_ULongArray___get_size__impl__ju6dtr(this.uv_1) < requiredCapacity) {
      var tmp = this;
      var tmp0 = this.uv_1;
      // Inline function 'kotlin.collections.copyOf' call
      var newSize = coerceAtLeast(requiredCapacity, imul(_ULongArray___get_size__impl__ju6dtr(this.uv_1), 2));
      tmp.uv_1 = _ULongArray___init__impl__twm1l3_0(copyOf_2(_ULongArray___get_storage__impl__28e64j(tmp0), newSize));
    }
  };
  protoOf(ULongArrayBuilder).wv = function (c) {
    this.pr();
    var tmp = this.uv_1;
    var _unary__edvuaz = this.vv_1;
    this.vv_1 = _unary__edvuaz + 1 | 0;
    ULongArray__set_impl_z19mvh(tmp, _unary__edvuaz, c);
  };
  protoOf(ULongArrayBuilder).my = function () {
    var tmp0 = this.uv_1;
    // Inline function 'kotlin.collections.copyOf' call
    var newSize = this.vv_1;
    return _ULongArray___init__impl__twm1l3_0(copyOf_2(_ULongArray___get_storage__impl__28e64j(tmp0), newSize));
  };
  protoOf(ULongArrayBuilder).gr = function () {
    return new ULongArray(this.my());
  };
  function IntArrayBuilder(bufferWithData) {
    PrimitiveArrayBuilder.call(this);
    this.dw_1 = bufferWithData;
    this.ew_1 = bufferWithData.length;
    this.ir(10);
  }
  protoOf(IntArrayBuilder).er = function () {
    return this.ew_1;
  };
  protoOf(IntArrayBuilder).ir = function (requiredCapacity) {
    if (this.dw_1.length < requiredCapacity)
      this.dw_1 = copyOf_3(this.dw_1, coerceAtLeast(requiredCapacity, imul(this.dw_1.length, 2)));
  };
  protoOf(IntArrayBuilder).fw = function (c) {
    this.pr();
    var tmp = this.dw_1;
    var _unary__edvuaz = this.ew_1;
    this.ew_1 = _unary__edvuaz + 1 | 0;
    tmp[_unary__edvuaz] = c;
  };
  protoOf(IntArrayBuilder).gr = function () {
    return copyOf_3(this.dw_1, this.ew_1);
  };
  function UIntArrayBuilder(bufferWithData) {
    PrimitiveArrayBuilder.call(this);
    this.nw_1 = bufferWithData;
    this.ow_1 = _UIntArray___get_size__impl__r6l8ci(bufferWithData);
    this.ir(10);
  }
  protoOf(UIntArrayBuilder).er = function () {
    return this.ow_1;
  };
  protoOf(UIntArrayBuilder).ir = function (requiredCapacity) {
    if (_UIntArray___get_size__impl__r6l8ci(this.nw_1) < requiredCapacity) {
      var tmp = this;
      var tmp0 = this.nw_1;
      // Inline function 'kotlin.collections.copyOf' call
      var newSize = coerceAtLeast(requiredCapacity, imul(_UIntArray___get_size__impl__r6l8ci(this.nw_1), 2));
      tmp.nw_1 = _UIntArray___init__impl__ghjpc6_0(copyOf_3(_UIntArray___get_storage__impl__92a0v0(tmp0), newSize));
    }
  };
  protoOf(UIntArrayBuilder).pw = function (c) {
    this.pr();
    var tmp = this.nw_1;
    var _unary__edvuaz = this.ow_1;
    this.ow_1 = _unary__edvuaz + 1 | 0;
    UIntArray__set_impl_7f2zu2(tmp, _unary__edvuaz, c);
  };
  protoOf(UIntArrayBuilder).ny = function () {
    var tmp0 = this.nw_1;
    // Inline function 'kotlin.collections.copyOf' call
    var newSize = this.ow_1;
    return _UIntArray___init__impl__ghjpc6_0(copyOf_3(_UIntArray___get_storage__impl__92a0v0(tmp0), newSize));
  };
  protoOf(UIntArrayBuilder).gr = function () {
    return new UIntArray(this.ny());
  };
  function ShortArrayBuilder(bufferWithData) {
    PrimitiveArrayBuilder.call(this);
    this.ww_1 = bufferWithData;
    this.xw_1 = bufferWithData.length;
    this.ir(10);
  }
  protoOf(ShortArrayBuilder).er = function () {
    return this.xw_1;
  };
  protoOf(ShortArrayBuilder).ir = function (requiredCapacity) {
    if (this.ww_1.length < requiredCapacity)
      this.ww_1 = copyOf_4(this.ww_1, coerceAtLeast(requiredCapacity, imul(this.ww_1.length, 2)));
  };
  protoOf(ShortArrayBuilder).yw = function (c) {
    this.pr();
    var tmp = this.ww_1;
    var _unary__edvuaz = this.xw_1;
    this.xw_1 = _unary__edvuaz + 1 | 0;
    tmp[_unary__edvuaz] = c;
  };
  protoOf(ShortArrayBuilder).gr = function () {
    return copyOf_4(this.ww_1, this.xw_1);
  };
  function UShortArrayBuilder(bufferWithData) {
    PrimitiveArrayBuilder.call(this);
    this.gx_1 = bufferWithData;
    this.hx_1 = _UShortArray___get_size__impl__jqto1b(bufferWithData);
    this.ir(10);
  }
  protoOf(UShortArrayBuilder).er = function () {
    return this.hx_1;
  };
  protoOf(UShortArrayBuilder).ir = function (requiredCapacity) {
    if (_UShortArray___get_size__impl__jqto1b(this.gx_1) < requiredCapacity) {
      var tmp = this;
      var tmp0 = this.gx_1;
      // Inline function 'kotlin.collections.copyOf' call
      var newSize = coerceAtLeast(requiredCapacity, imul(_UShortArray___get_size__impl__jqto1b(this.gx_1), 2));
      tmp.gx_1 = _UShortArray___init__impl__9b26ef_0(copyOf_4(_UShortArray___get_storage__impl__t2jpv5(tmp0), newSize));
    }
  };
  protoOf(UShortArrayBuilder).ix = function (c) {
    this.pr();
    var tmp = this.gx_1;
    var _unary__edvuaz = this.hx_1;
    this.hx_1 = _unary__edvuaz + 1 | 0;
    UShortArray__set_impl_6d8whp(tmp, _unary__edvuaz, c);
  };
  protoOf(UShortArrayBuilder).oy = function () {
    var tmp0 = this.gx_1;
    // Inline function 'kotlin.collections.copyOf' call
    var newSize = this.hx_1;
    return _UShortArray___init__impl__9b26ef_0(copyOf_4(_UShortArray___get_storage__impl__t2jpv5(tmp0), newSize));
  };
  protoOf(UShortArrayBuilder).gr = function () {
    return new UShortArray(this.oy());
  };
  function ByteArrayBuilder(bufferWithData) {
    PrimitiveArrayBuilder.call(this);
    this.px_1 = bufferWithData;
    this.qx_1 = bufferWithData.length;
    this.ir(10);
  }
  protoOf(ByteArrayBuilder).er = function () {
    return this.qx_1;
  };
  protoOf(ByteArrayBuilder).ir = function (requiredCapacity) {
    if (this.px_1.length < requiredCapacity)
      this.px_1 = copyOf_5(this.px_1, coerceAtLeast(requiredCapacity, imul(this.px_1.length, 2)));
  };
  protoOf(ByteArrayBuilder).rx = function (c) {
    this.pr();
    var tmp = this.px_1;
    var _unary__edvuaz = this.qx_1;
    this.qx_1 = _unary__edvuaz + 1 | 0;
    tmp[_unary__edvuaz] = c;
  };
  protoOf(ByteArrayBuilder).gr = function () {
    return copyOf_5(this.px_1, this.qx_1);
  };
  function UByteArrayBuilder(bufferWithData) {
    PrimitiveArrayBuilder.call(this);
    this.zx_1 = bufferWithData;
    this.ay_1 = _UByteArray___get_size__impl__h6pkdv(bufferWithData);
    this.ir(10);
  }
  protoOf(UByteArrayBuilder).er = function () {
    return this.ay_1;
  };
  protoOf(UByteArrayBuilder).ir = function (requiredCapacity) {
    if (_UByteArray___get_size__impl__h6pkdv(this.zx_1) < requiredCapacity) {
      var tmp = this;
      var tmp0 = this.zx_1;
      // Inline function 'kotlin.collections.copyOf' call
      var newSize = coerceAtLeast(requiredCapacity, imul(_UByteArray___get_size__impl__h6pkdv(this.zx_1), 2));
      tmp.zx_1 = _UByteArray___init__impl__ip4y9n_0(copyOf_5(_UByteArray___get_storage__impl__d4kctt(tmp0), newSize));
    }
  };
  protoOf(UByteArrayBuilder).by = function (c) {
    this.pr();
    var tmp = this.zx_1;
    var _unary__edvuaz = this.ay_1;
    this.ay_1 = _unary__edvuaz + 1 | 0;
    UByteArray__set_impl_jvcicn(tmp, _unary__edvuaz, c);
  };
  protoOf(UByteArrayBuilder).py = function () {
    var tmp0 = this.zx_1;
    // Inline function 'kotlin.collections.copyOf' call
    var newSize = this.ay_1;
    return _UByteArray___init__impl__ip4y9n_0(copyOf_5(_UByteArray___get_storage__impl__d4kctt(tmp0), newSize));
  };
  protoOf(UByteArrayBuilder).gr = function () {
    return new UByteArray(this.py());
  };
  function BooleanArrayBuilder(bufferWithData) {
    PrimitiveArrayBuilder.call(this);
    this.iy_1 = bufferWithData;
    this.jy_1 = bufferWithData.length;
    this.ir(10);
  }
  protoOf(BooleanArrayBuilder).er = function () {
    return this.jy_1;
  };
  protoOf(BooleanArrayBuilder).ir = function (requiredCapacity) {
    if (this.iy_1.length < requiredCapacity)
      this.iy_1 = copyOf_6(this.iy_1, coerceAtLeast(requiredCapacity, imul(this.iy_1.length, 2)));
  };
  protoOf(BooleanArrayBuilder).ky = function (c) {
    this.pr();
    var tmp = this.iy_1;
    var _unary__edvuaz = this.jy_1;
    this.jy_1 = _unary__edvuaz + 1 | 0;
    tmp[_unary__edvuaz] = c;
  };
  protoOf(BooleanArrayBuilder).gr = function () {
    return copyOf_6(this.iy_1, this.jy_1);
  };
  function get_BUILTIN_SERIALIZERS() {
    _init_properties_Primitives_kt__k0eto4();
    return BUILTIN_SERIALIZERS;
  }
  var BUILTIN_SERIALIZERS;
  function builtinSerializerOrNull(_this__u8e3s4) {
    _init_properties_Primitives_kt__k0eto4();
    var tmp = get_BUILTIN_SERIALIZERS().v1(_this__u8e3s4);
    return (tmp == null ? true : isInterface(tmp, KSerializer)) ? tmp : THROW_CCE();
  }
  function StringSerializer() {
    StringSerializer_instance = this;
    this.qy_1 = new PrimitiveSerialDescriptor_0('kotlin.String', STRING_getInstance());
  }
  protoOf(StringSerializer).oi = function () {
    return this.qy_1;
  };
  protoOf(StringSerializer).ry = function (encoder, value) {
    return encoder.tm(value);
  };
  protoOf(StringSerializer).pi = function (encoder, value) {
    return this.ry(encoder, (!(value == null) ? typeof value === 'string' : false) ? value : THROW_CCE());
  };
  protoOf(StringSerializer).qi = function (decoder) {
    return decoder.kl();
  };
  var StringSerializer_instance;
  function StringSerializer_getInstance() {
    if (StringSerializer_instance == null)
      new StringSerializer();
    return StringSerializer_instance;
  }
  function CharSerializer() {
    CharSerializer_instance = this;
    this.sy_1 = new PrimitiveSerialDescriptor_0('kotlin.Char', CHAR_getInstance());
  }
  protoOf(CharSerializer).oi = function () {
    return this.sy_1;
  };
  protoOf(CharSerializer).ty = function (encoder, value) {
    return encoder.sm(value);
  };
  protoOf(CharSerializer).pi = function (encoder, value) {
    return this.ty(encoder, value instanceof Char ? value.d1_1 : THROW_CCE());
  };
  protoOf(CharSerializer).uy = function (decoder) {
    return decoder.jl();
  };
  protoOf(CharSerializer).qi = function (decoder) {
    return new Char(this.uy(decoder));
  };
  var CharSerializer_instance;
  function CharSerializer_getInstance() {
    if (CharSerializer_instance == null)
      new CharSerializer();
    return CharSerializer_instance;
  }
  function DoubleSerializer() {
    DoubleSerializer_instance = this;
    this.vy_1 = new PrimitiveSerialDescriptor_0('kotlin.Double', DOUBLE_getInstance());
  }
  protoOf(DoubleSerializer).oi = function () {
    return this.vy_1;
  };
  protoOf(DoubleSerializer).wy = function (encoder, value) {
    return encoder.rm(value);
  };
  protoOf(DoubleSerializer).pi = function (encoder, value) {
    return this.wy(encoder, (!(value == null) ? typeof value === 'number' : false) ? value : THROW_CCE());
  };
  protoOf(DoubleSerializer).qi = function (decoder) {
    return decoder.il();
  };
  var DoubleSerializer_instance;
  function DoubleSerializer_getInstance() {
    if (DoubleSerializer_instance == null)
      new DoubleSerializer();
    return DoubleSerializer_instance;
  }
  function FloatSerializer() {
    FloatSerializer_instance = this;
    this.xy_1 = new PrimitiveSerialDescriptor_0('kotlin.Float', FLOAT_getInstance());
  }
  protoOf(FloatSerializer).oi = function () {
    return this.xy_1;
  };
  protoOf(FloatSerializer).yy = function (encoder, value) {
    return encoder.qm(value);
  };
  protoOf(FloatSerializer).pi = function (encoder, value) {
    return this.yy(encoder, (!(value == null) ? typeof value === 'number' : false) ? value : THROW_CCE());
  };
  protoOf(FloatSerializer).qi = function (decoder) {
    return decoder.hl();
  };
  var FloatSerializer_instance;
  function FloatSerializer_getInstance() {
    if (FloatSerializer_instance == null)
      new FloatSerializer();
    return FloatSerializer_instance;
  }
  function LongSerializer() {
    LongSerializer_instance = this;
    this.zy_1 = new PrimitiveSerialDescriptor_0('kotlin.Long', LONG_getInstance());
  }
  protoOf(LongSerializer).oi = function () {
    return this.zy_1;
  };
  protoOf(LongSerializer).az = function (encoder, value) {
    return encoder.pm(value);
  };
  protoOf(LongSerializer).pi = function (encoder, value) {
    return this.az(encoder, value instanceof Long ? value : THROW_CCE());
  };
  protoOf(LongSerializer).qi = function (decoder) {
    return decoder.gl();
  };
  var LongSerializer_instance;
  function LongSerializer_getInstance() {
    if (LongSerializer_instance == null)
      new LongSerializer();
    return LongSerializer_instance;
  }
  function IntSerializer() {
    IntSerializer_instance = this;
    this.bz_1 = new PrimitiveSerialDescriptor_0('kotlin.Int', INT_getInstance());
  }
  protoOf(IntSerializer).oi = function () {
    return this.bz_1;
  };
  protoOf(IntSerializer).cz = function (encoder, value) {
    return encoder.om(value);
  };
  protoOf(IntSerializer).pi = function (encoder, value) {
    return this.cz(encoder, (!(value == null) ? typeof value === 'number' : false) ? value : THROW_CCE());
  };
  protoOf(IntSerializer).qi = function (decoder) {
    return decoder.fl();
  };
  var IntSerializer_instance;
  function IntSerializer_getInstance() {
    if (IntSerializer_instance == null)
      new IntSerializer();
    return IntSerializer_instance;
  }
  function ShortSerializer() {
    ShortSerializer_instance = this;
    this.dz_1 = new PrimitiveSerialDescriptor_0('kotlin.Short', SHORT_getInstance());
  }
  protoOf(ShortSerializer).oi = function () {
    return this.dz_1;
  };
  protoOf(ShortSerializer).ez = function (encoder, value) {
    return encoder.nm(value);
  };
  protoOf(ShortSerializer).pi = function (encoder, value) {
    return this.ez(encoder, (!(value == null) ? typeof value === 'number' : false) ? value : THROW_CCE());
  };
  protoOf(ShortSerializer).qi = function (decoder) {
    return decoder.el();
  };
  var ShortSerializer_instance;
  function ShortSerializer_getInstance() {
    if (ShortSerializer_instance == null)
      new ShortSerializer();
    return ShortSerializer_instance;
  }
  function ByteSerializer() {
    ByteSerializer_instance = this;
    this.fz_1 = new PrimitiveSerialDescriptor_0('kotlin.Byte', BYTE_getInstance());
  }
  protoOf(ByteSerializer).oi = function () {
    return this.fz_1;
  };
  protoOf(ByteSerializer).gz = function (encoder, value) {
    return encoder.mm(value);
  };
  protoOf(ByteSerializer).pi = function (encoder, value) {
    return this.gz(encoder, (!(value == null) ? typeof value === 'number' : false) ? value : THROW_CCE());
  };
  protoOf(ByteSerializer).qi = function (decoder) {
    return decoder.dl();
  };
  var ByteSerializer_instance;
  function ByteSerializer_getInstance() {
    if (ByteSerializer_instance == null)
      new ByteSerializer();
    return ByteSerializer_instance;
  }
  function BooleanSerializer() {
    BooleanSerializer_instance = this;
    this.hz_1 = new PrimitiveSerialDescriptor_0('kotlin.Boolean', BOOLEAN_getInstance());
  }
  protoOf(BooleanSerializer).oi = function () {
    return this.hz_1;
  };
  protoOf(BooleanSerializer).iz = function (encoder, value) {
    return encoder.lm(value);
  };
  protoOf(BooleanSerializer).pi = function (encoder, value) {
    return this.iz(encoder, (!(value == null) ? typeof value === 'boolean' : false) ? value : THROW_CCE());
  };
  protoOf(BooleanSerializer).qi = function (decoder) {
    return decoder.cl();
  };
  var BooleanSerializer_instance;
  function BooleanSerializer_getInstance() {
    if (BooleanSerializer_instance == null)
      new BooleanSerializer();
    return BooleanSerializer_instance;
  }
  function UnitSerializer() {
    UnitSerializer_instance = this;
    this.jz_1 = new ObjectSerializer('kotlin.Unit', Unit_instance);
  }
  protoOf(UnitSerializer).oi = function () {
    return this.jz_1.oi();
  };
  protoOf(UnitSerializer).kz = function (encoder, value) {
    this.jz_1.ej(encoder, Unit_instance);
  };
  protoOf(UnitSerializer).pi = function (encoder, value) {
    return this.kz(encoder, value instanceof Unit ? value : THROW_CCE());
  };
  protoOf(UnitSerializer).lz = function (decoder) {
    this.jz_1.qi(decoder);
  };
  protoOf(UnitSerializer).qi = function (decoder) {
    this.lz(decoder);
    return Unit_instance;
  };
  var UnitSerializer_instance;
  function UnitSerializer_getInstance() {
    if (UnitSerializer_instance == null)
      new UnitSerializer();
    return UnitSerializer_instance;
  }
  function error_0($this) {
    throw IllegalStateException_init_$Create$('Primitive descriptor does not have elements');
  }
  function PrimitiveSerialDescriptor_0(serialName, kind) {
    this.mz_1 = serialName;
    this.nz_1 = kind;
  }
  protoOf(PrimitiveSerialDescriptor_0).sj = function () {
    return this.mz_1;
  };
  protoOf(PrimitiveSerialDescriptor_0).tj = function () {
    return this.nz_1;
  };
  protoOf(PrimitiveSerialDescriptor_0).vj = function () {
    return 0;
  };
  protoOf(PrimitiveSerialDescriptor_0).xj = function (index) {
    error_0(this);
  };
  protoOf(PrimitiveSerialDescriptor_0).yj = function (name) {
    error_0(this);
  };
  protoOf(PrimitiveSerialDescriptor_0).bk = function (index) {
    error_0(this);
  };
  protoOf(PrimitiveSerialDescriptor_0).ak = function (index) {
    error_0(this);
  };
  protoOf(PrimitiveSerialDescriptor_0).zj = function (index) {
    error_0(this);
  };
  protoOf(PrimitiveSerialDescriptor_0).toString = function () {
    return 'PrimitiveDescriptor(' + this.mz_1 + ')';
  };
  protoOf(PrimitiveSerialDescriptor_0).equals = function (other) {
    if (this === other)
      return true;
    if (!(other instanceof PrimitiveSerialDescriptor_0))
      return false;
    if (this.mz_1 === other.mz_1 && equals(this.nz_1, other.nz_1))
      return true;
    return false;
  };
  protoOf(PrimitiveSerialDescriptor_0).hashCode = function () {
    return getStringHashCode(this.mz_1) + imul(31, this.nz_1.hashCode()) | 0;
  };
  function PrimitiveDescriptorSafe(serialName, kind) {
    _init_properties_Primitives_kt__k0eto4();
    checkName(serialName);
    return new PrimitiveSerialDescriptor_0(serialName, kind);
  }
  function checkName(serialName) {
    _init_properties_Primitives_kt__k0eto4();
    var values = get_BUILTIN_SERIALIZERS().x1();
    var _iterator__ex2g4s = values.g();
    while (_iterator__ex2g4s.h()) {
      var primitive = _iterator__ex2g4s.i();
      var primitiveName = primitive.oi().sj();
      if (serialName === primitiveName) {
        throw IllegalArgumentException_init_$Create$(trimIndent('\n                The name of serial descriptor should uniquely identify associated serializer.\n                For serial name ' + serialName + ' there already exists ' + getKClassFromExpression(primitive).z8() + '.\n                Please refer to SerialDescriptor documentation for additional information.\n            '));
      }
    }
  }
  var properties_initialized_Primitives_kt_6dpii6;
  function _init_properties_Primitives_kt__k0eto4() {
    if (!properties_initialized_Primitives_kt_6dpii6) {
      properties_initialized_Primitives_kt_6dpii6 = true;
      BUILTIN_SERIALIZERS = initBuiltins();
    }
  }
  function NamedValueDecoder() {
    TaggedDecoder.call(this);
  }
  protoOf(NamedValueDecoder).qz = function (_this__u8e3s4, index) {
    return this.sz(this.rz(_this__u8e3s4, index));
  };
  protoOf(NamedValueDecoder).sz = function (nestedName) {
    var tmp0_elvis_lhs = this.vz();
    return this.wz(tmp0_elvis_lhs == null ? '' : tmp0_elvis_lhs, nestedName);
  };
  protoOf(NamedValueDecoder).rz = function (descriptor, index) {
    return descriptor.xj(index);
  };
  protoOf(NamedValueDecoder).wz = function (parentName, childName) {
    var tmp;
    // Inline function 'kotlin.text.isEmpty' call
    if (charSequenceLength(parentName) === 0) {
      tmp = childName;
    } else {
      tmp = parentName + '.' + childName;
    }
    return tmp;
  };
  protoOf(NamedValueDecoder).xz = function () {
    return this.tz_1.p() ? '$' : joinToString(this.tz_1, '.', '$.');
  };
  function tagBlock($this, tag, block) {
    $this.l10(tag);
    var r = block();
    if (!$this.uz_1) {
      $this.m10();
    }
    $this.uz_1 = false;
    return r;
  }
  function TaggedDecoder$decodeSerializableElement$lambda(this$0, $deserializer, $previousValue) {
    return function () {
      return this$0.nl($deserializer, $previousValue);
    };
  }
  function TaggedDecoder$decodeNullableSerializableElement$lambda(this$0, $deserializer, $previousValue) {
    return function () {
      var tmp0 = this$0;
      // Inline function 'kotlinx.serialization.encoding.decodeIfNullable' call
      var isNullabilitySupported = $deserializer.oi().oj();
      var tmp;
      if (isNullabilitySupported || tmp0.al()) {
        tmp = this$0.nl($deserializer, $previousValue);
      } else {
        tmp = tmp0.bl();
      }
      return tmp;
    };
  }
  function TaggedDecoder() {
    var tmp = this;
    // Inline function 'kotlin.collections.arrayListOf' call
    tmp.tz_1 = ArrayList_init_$Create$_0();
    this.uz_1 = false;
  }
  protoOf(TaggedDecoder).em = function () {
    return EmptySerializersModule_0();
  };
  protoOf(TaggedDecoder).yz = function (tag) {
    throw SerializationException_init_$Create$_0(toString(getKClassFromExpression(this)) + " can't retrieve untyped values");
  };
  protoOf(TaggedDecoder).zz = function (tag) {
    return true;
  };
  protoOf(TaggedDecoder).a10 = function (tag) {
    var tmp = this.yz(tag);
    return typeof tmp === 'boolean' ? tmp : THROW_CCE();
  };
  protoOf(TaggedDecoder).b10 = function (tag) {
    var tmp = this.yz(tag);
    return typeof tmp === 'number' ? tmp : THROW_CCE();
  };
  protoOf(TaggedDecoder).c10 = function (tag) {
    var tmp = this.yz(tag);
    return typeof tmp === 'number' ? tmp : THROW_CCE();
  };
  protoOf(TaggedDecoder).d10 = function (tag) {
    var tmp = this.yz(tag);
    return typeof tmp === 'number' ? tmp : THROW_CCE();
  };
  protoOf(TaggedDecoder).e10 = function (tag) {
    var tmp = this.yz(tag);
    return tmp instanceof Long ? tmp : THROW_CCE();
  };
  protoOf(TaggedDecoder).f10 = function (tag) {
    var tmp = this.yz(tag);
    return typeof tmp === 'number' ? tmp : THROW_CCE();
  };
  protoOf(TaggedDecoder).g10 = function (tag) {
    var tmp = this.yz(tag);
    return typeof tmp === 'number' ? tmp : THROW_CCE();
  };
  protoOf(TaggedDecoder).h10 = function (tag) {
    var tmp = this.yz(tag);
    return tmp instanceof Char ? tmp.d1_1 : THROW_CCE();
  };
  protoOf(TaggedDecoder).i10 = function (tag) {
    var tmp = this.yz(tag);
    return typeof tmp === 'string' ? tmp : THROW_CCE();
  };
  protoOf(TaggedDecoder).j10 = function (tag, enumDescriptor) {
    var tmp = this.yz(tag);
    return typeof tmp === 'number' ? tmp : THROW_CCE();
  };
  protoOf(TaggedDecoder).k10 = function (tag, inlineDescriptor) {
    // Inline function 'kotlin.apply' call
    this.l10(tag);
    return this;
  };
  protoOf(TaggedDecoder).nl = function (deserializer, previousValue) {
    return this.ol(deserializer);
  };
  protoOf(TaggedDecoder).ml = function (descriptor) {
    return this.k10(this.m10(), descriptor);
  };
  protoOf(TaggedDecoder).al = function () {
    var tmp0_elvis_lhs = this.vz();
    var tmp;
    if (tmp0_elvis_lhs == null) {
      return false;
    } else {
      tmp = tmp0_elvis_lhs;
    }
    var currentTag = tmp;
    return this.zz(currentTag);
  };
  protoOf(TaggedDecoder).bl = function () {
    return null;
  };
  protoOf(TaggedDecoder).cl = function () {
    return this.a10(this.m10());
  };
  protoOf(TaggedDecoder).dl = function () {
    return this.b10(this.m10());
  };
  protoOf(TaggedDecoder).el = function () {
    return this.c10(this.m10());
  };
  protoOf(TaggedDecoder).fl = function () {
    return this.d10(this.m10());
  };
  protoOf(TaggedDecoder).gl = function () {
    return this.e10(this.m10());
  };
  protoOf(TaggedDecoder).hl = function () {
    return this.f10(this.m10());
  };
  protoOf(TaggedDecoder).il = function () {
    return this.g10(this.m10());
  };
  protoOf(TaggedDecoder).jl = function () {
    return this.h10(this.m10());
  };
  protoOf(TaggedDecoder).kl = function () {
    return this.i10(this.m10());
  };
  protoOf(TaggedDecoder).ll = function (enumDescriptor) {
    return this.j10(this.m10(), enumDescriptor);
  };
  protoOf(TaggedDecoder).pl = function (descriptor) {
    return this;
  };
  protoOf(TaggedDecoder).ql = function (descriptor) {
  };
  protoOf(TaggedDecoder).rl = function (descriptor, index) {
    return this.a10(this.qz(descriptor, index));
  };
  protoOf(TaggedDecoder).sl = function (descriptor, index) {
    return this.b10(this.qz(descriptor, index));
  };
  protoOf(TaggedDecoder).tl = function (descriptor, index) {
    return this.c10(this.qz(descriptor, index));
  };
  protoOf(TaggedDecoder).ul = function (descriptor, index) {
    return this.d10(this.qz(descriptor, index));
  };
  protoOf(TaggedDecoder).vl = function (descriptor, index) {
    return this.e10(this.qz(descriptor, index));
  };
  protoOf(TaggedDecoder).wl = function (descriptor, index) {
    return this.f10(this.qz(descriptor, index));
  };
  protoOf(TaggedDecoder).xl = function (descriptor, index) {
    return this.g10(this.qz(descriptor, index));
  };
  protoOf(TaggedDecoder).yl = function (descriptor, index) {
    return this.h10(this.qz(descriptor, index));
  };
  protoOf(TaggedDecoder).zl = function (descriptor, index) {
    return this.i10(this.qz(descriptor, index));
  };
  protoOf(TaggedDecoder).am = function (descriptor, index) {
    return this.k10(this.qz(descriptor, index), descriptor.ak(index));
  };
  protoOf(TaggedDecoder).bm = function (descriptor, index, deserializer, previousValue) {
    var tmp = this.qz(descriptor, index);
    return tagBlock(this, tmp, TaggedDecoder$decodeSerializableElement$lambda(this, deserializer, previousValue));
  };
  protoOf(TaggedDecoder).dm = function (descriptor, index, deserializer, previousValue) {
    var tmp = this.qz(descriptor, index);
    return tagBlock(this, tmp, TaggedDecoder$decodeNullableSerializableElement$lambda(this, deserializer, previousValue));
  };
  protoOf(TaggedDecoder).vz = function () {
    return lastOrNull(this.tz_1);
  };
  protoOf(TaggedDecoder).l10 = function (name) {
    this.tz_1.e(name);
  };
  protoOf(TaggedDecoder).m10 = function () {
    var r = this.tz_1.b2(get_lastIndex_0(this.tz_1));
    this.uz_1 = true;
    return r;
  };
  function get_NULL() {
    _init_properties_Tuples_kt__dz0qyd();
    return NULL;
  }
  var NULL;
  function MapEntry(key, value) {
    this.n10_1 = key;
    this.o10_1 = value;
  }
  protoOf(MapEntry).r1 = function () {
    return this.n10_1;
  };
  protoOf(MapEntry).s1 = function () {
    return this.o10_1;
  };
  protoOf(MapEntry).toString = function () {
    return 'MapEntry(key=' + toString_0(this.n10_1) + ', value=' + toString_0(this.o10_1) + ')';
  };
  protoOf(MapEntry).hashCode = function () {
    var result = this.n10_1 == null ? 0 : hashCode(this.n10_1);
    result = imul(result, 31) + (this.o10_1 == null ? 0 : hashCode(this.o10_1)) | 0;
    return result;
  };
  protoOf(MapEntry).equals = function (other) {
    if (this === other)
      return true;
    if (!(other instanceof MapEntry))
      return false;
    var tmp0_other_with_cast = other instanceof MapEntry ? other : THROW_CCE();
    if (!equals(this.n10_1, tmp0_other_with_cast.n10_1))
      return false;
    if (!equals(this.o10_1, tmp0_other_with_cast.o10_1))
      return false;
    return true;
  };
  function MapEntrySerializer$descriptor$lambda($keySerializer, $valueSerializer) {
    return function ($this$buildSerialDescriptor) {
      $this$buildSerialDescriptor.zi('key', $keySerializer.oi());
      $this$buildSerialDescriptor.zi('value', $valueSerializer.oi());
      return Unit_instance;
    };
  }
  function MapEntrySerializer_0(keySerializer, valueSerializer) {
    KeyValueSerializer.call(this, keySerializer, valueSerializer);
    var tmp = this;
    var tmp_0 = MAP_getInstance();
    tmp.r10_1 = buildSerialDescriptor('kotlin.collections.Map.Entry', tmp_0, [], MapEntrySerializer$descriptor$lambda(keySerializer, valueSerializer));
  }
  protoOf(MapEntrySerializer_0).oi = function () {
    return this.r10_1;
  };
  protoOf(MapEntrySerializer_0).s10 = function (_this__u8e3s4) {
    return _this__u8e3s4.r1();
  };
  protoOf(MapEntrySerializer_0).t10 = function (_this__u8e3s4) {
    return this.s10((!(_this__u8e3s4 == null) ? isInterface(_this__u8e3s4, Entry) : false) ? _this__u8e3s4 : THROW_CCE());
  };
  protoOf(MapEntrySerializer_0).u10 = function (_this__u8e3s4) {
    return _this__u8e3s4.s1();
  };
  protoOf(MapEntrySerializer_0).v10 = function (_this__u8e3s4) {
    return this.u10((!(_this__u8e3s4 == null) ? isInterface(_this__u8e3s4, Entry) : false) ? _this__u8e3s4 : THROW_CCE());
  };
  protoOf(MapEntrySerializer_0).w10 = function (key, value) {
    return new MapEntry(key, value);
  };
  function PairSerializer$descriptor$lambda($keySerializer, $valueSerializer) {
    return function ($this$buildClassSerialDescriptor) {
      $this$buildClassSerialDescriptor.zi('first', $keySerializer.oi());
      $this$buildClassSerialDescriptor.zi('second', $valueSerializer.oi());
      return Unit_instance;
    };
  }
  function PairSerializer_0(keySerializer, valueSerializer) {
    KeyValueSerializer.call(this, keySerializer, valueSerializer);
    var tmp = this;
    tmp.c11_1 = buildClassSerialDescriptor('kotlin.Pair', [], PairSerializer$descriptor$lambda(keySerializer, valueSerializer));
  }
  protoOf(PairSerializer_0).oi = function () {
    return this.c11_1;
  };
  protoOf(PairSerializer_0).d11 = function (_this__u8e3s4) {
    return _this__u8e3s4.hd_1;
  };
  protoOf(PairSerializer_0).t10 = function (_this__u8e3s4) {
    return this.d11(_this__u8e3s4 instanceof Pair ? _this__u8e3s4 : THROW_CCE());
  };
  protoOf(PairSerializer_0).e11 = function (_this__u8e3s4) {
    return _this__u8e3s4.id_1;
  };
  protoOf(PairSerializer_0).v10 = function (_this__u8e3s4) {
    return this.e11(_this__u8e3s4 instanceof Pair ? _this__u8e3s4 : THROW_CCE());
  };
  protoOf(PairSerializer_0).w10 = function (key, value) {
    return to(key, value);
  };
  function decodeSequentially_1($this, composite) {
    var a = composite.cm($this.i11_1, 0, $this.f11_1);
    var b = composite.cm($this.i11_1, 1, $this.g11_1);
    var c = composite.cm($this.i11_1, 2, $this.h11_1);
    composite.ql($this.i11_1);
    return new Triple(a, b, c);
  }
  function decodeStructure($this, composite) {
    var a = get_NULL();
    var b = get_NULL();
    var c = get_NULL();
    mainLoop: while (true) {
      var index = composite.gm($this.i11_1);
      switch (index) {
        case -1:
          break mainLoop;
        case 0:
          a = composite.cm($this.i11_1, 0, $this.f11_1);
          break;
        case 1:
          b = composite.cm($this.i11_1, 1, $this.g11_1);
          break;
        case 2:
          c = composite.cm($this.i11_1, 2, $this.h11_1);
          break;
        default:
          throw SerializationException_init_$Create$_0('Unexpected index ' + index);
      }
    }
    composite.ql($this.i11_1);
    if (a === get_NULL())
      throw SerializationException_init_$Create$_0("Element 'first' is missing");
    if (b === get_NULL())
      throw SerializationException_init_$Create$_0("Element 'second' is missing");
    if (c === get_NULL())
      throw SerializationException_init_$Create$_0("Element 'third' is missing");
    var tmp = (a == null ? true : !(a == null)) ? a : THROW_CCE();
    var tmp_0 = (b == null ? true : !(b == null)) ? b : THROW_CCE();
    return new Triple(tmp, tmp_0, (c == null ? true : !(c == null)) ? c : THROW_CCE());
  }
  function TripleSerializer$descriptor$lambda(this$0) {
    return function ($this$buildClassSerialDescriptor) {
      $this$buildClassSerialDescriptor.zi('first', this$0.f11_1.oi());
      $this$buildClassSerialDescriptor.zi('second', this$0.g11_1.oi());
      $this$buildClassSerialDescriptor.zi('third', this$0.h11_1.oi());
      return Unit_instance;
    };
  }
  function TripleSerializer_0(aSerializer, bSerializer, cSerializer) {
    this.f11_1 = aSerializer;
    this.g11_1 = bSerializer;
    this.h11_1 = cSerializer;
    var tmp = this;
    tmp.i11_1 = buildClassSerialDescriptor('kotlin.Triple', [], TripleSerializer$descriptor$lambda(this));
  }
  protoOf(TripleSerializer_0).oi = function () {
    return this.i11_1;
  };
  protoOf(TripleSerializer_0).j11 = function (encoder, value) {
    var structuredEncoder = encoder.pl(this.i11_1);
    structuredEncoder.gn(this.i11_1, 0, this.f11_1, value.sg_1);
    structuredEncoder.gn(this.i11_1, 1, this.g11_1, value.tg_1);
    structuredEncoder.gn(this.i11_1, 2, this.h11_1, value.ug_1);
    structuredEncoder.ql(this.i11_1);
  };
  protoOf(TripleSerializer_0).pi = function (encoder, value) {
    return this.j11(encoder, value instanceof Triple ? value : THROW_CCE());
  };
  protoOf(TripleSerializer_0).qi = function (decoder) {
    var composite = decoder.pl(this.i11_1);
    if (composite.fm()) {
      return decodeSequentially_1(this, composite);
    }
    return decodeStructure(this, composite);
  };
  function KeyValueSerializer(keySerializer, valueSerializer) {
    this.x10_1 = keySerializer;
    this.y10_1 = valueSerializer;
  }
  protoOf(KeyValueSerializer).z10 = function (encoder, value) {
    var structuredEncoder = encoder.pl(this.oi());
    structuredEncoder.gn(this.oi(), 0, this.x10_1, this.t10(value));
    structuredEncoder.gn(this.oi(), 1, this.y10_1, this.v10(value));
    structuredEncoder.ql(this.oi());
  };
  protoOf(KeyValueSerializer).pi = function (encoder, value) {
    return this.z10(encoder, (value == null ? true : !(value == null)) ? value : THROW_CCE());
  };
  protoOf(KeyValueSerializer).qi = function (decoder) {
    // Inline function 'kotlinx.serialization.encoding.decodeStructure' call
    var descriptor = this.oi();
    var composite = decoder.pl(descriptor);
    var tmp$ret$0;
    $l$block: {
      if (composite.fm()) {
        var key = composite.cm(this.oi(), 0, this.x10_1);
        var value = composite.cm(this.oi(), 1, this.y10_1);
        tmp$ret$0 = this.w10(key, value);
        break $l$block;
      }
      var key_0 = get_NULL();
      var value_0 = get_NULL();
      mainLoop: while (true) {
        var idx = composite.gm(this.oi());
        switch (idx) {
          case -1:
            break mainLoop;
          case 0:
            key_0 = composite.cm(this.oi(), 0, this.x10_1);
            break;
          case 1:
            value_0 = composite.cm(this.oi(), 1, this.y10_1);
            break;
          default:
            throw SerializationException_init_$Create$_0('Invalid index: ' + idx);
        }
      }
      if (key_0 === get_NULL())
        throw SerializationException_init_$Create$_0("Element 'key' is missing");
      if (value_0 === get_NULL())
        throw SerializationException_init_$Create$_0("Element 'value' is missing");
      var tmp = (key_0 == null ? true : !(key_0 == null)) ? key_0 : THROW_CCE();
      tmp$ret$0 = this.w10(tmp, (value_0 == null ? true : !(value_0 == null)) ? value_0 : THROW_CCE());
    }
    var result = tmp$ret$0;
    composite.ql(descriptor);
    return result;
  };
  var properties_initialized_Tuples_kt_3vs7ar;
  function _init_properties_Tuples_kt__dz0qyd() {
    if (!properties_initialized_Tuples_kt_3vs7ar) {
      properties_initialized_Tuples_kt_3vs7ar = true;
      NULL = new Object();
    }
  }
  function ULongSerializer() {
    ULongSerializer_instance = this;
    this.k11_1 = InlinePrimitiveDescriptor('kotlin.ULong', serializer_4(Companion_getInstance_2()));
  }
  protoOf(ULongSerializer).oi = function () {
    return this.k11_1;
  };
  protoOf(ULongSerializer).l11 = function (encoder, value) {
    var tmp = encoder.vm(this.k11_1);
    // Inline function 'kotlin.ULong.toLong' call
    var tmp$ret$0 = _ULong___get_data__impl__fggpzb(value);
    tmp.pm(tmp$ret$0);
  };
  protoOf(ULongSerializer).pi = function (encoder, value) {
    return this.l11(encoder, value instanceof ULong ? value.yh_1 : THROW_CCE());
  };
  protoOf(ULongSerializer).m11 = function (decoder) {
    // Inline function 'kotlin.toULong' call
    var this_0 = decoder.ml(this.k11_1).gl();
    return _ULong___init__impl__c78o9k(this_0);
  };
  protoOf(ULongSerializer).qi = function (decoder) {
    return new ULong(this.m11(decoder));
  };
  var ULongSerializer_instance;
  function ULongSerializer_getInstance() {
    if (ULongSerializer_instance == null)
      new ULongSerializer();
    return ULongSerializer_instance;
  }
  function UIntSerializer() {
    UIntSerializer_instance = this;
    this.n11_1 = InlinePrimitiveDescriptor('kotlin.UInt', serializer_6(IntCompanionObject_instance));
  }
  protoOf(UIntSerializer).oi = function () {
    return this.n11_1;
  };
  protoOf(UIntSerializer).o11 = function (encoder, value) {
    var tmp = encoder.vm(this.n11_1);
    // Inline function 'kotlin.UInt.toInt' call
    var tmp$ret$0 = _UInt___get_data__impl__f0vqqw(value);
    tmp.om(tmp$ret$0);
  };
  protoOf(UIntSerializer).pi = function (encoder, value) {
    return this.o11(encoder, value instanceof UInt ? value.oh_1 : THROW_CCE());
  };
  protoOf(UIntSerializer).p11 = function (decoder) {
    // Inline function 'kotlin.toUInt' call
    var this_0 = decoder.ml(this.n11_1).fl();
    return _UInt___init__impl__l7qpdl(this_0);
  };
  protoOf(UIntSerializer).qi = function (decoder) {
    return new UInt(this.p11(decoder));
  };
  var UIntSerializer_instance;
  function UIntSerializer_getInstance() {
    if (UIntSerializer_instance == null)
      new UIntSerializer();
    return UIntSerializer_instance;
  }
  function UShortSerializer() {
    UShortSerializer_instance = this;
    this.q11_1 = InlinePrimitiveDescriptor('kotlin.UShort', serializer_8(ShortCompanionObject_instance));
  }
  protoOf(UShortSerializer).oi = function () {
    return this.q11_1;
  };
  protoOf(UShortSerializer).r11 = function (encoder, value) {
    var tmp = encoder.vm(this.q11_1);
    // Inline function 'kotlin.UShort.toShort' call
    var tmp$ret$0 = _UShort___get_data__impl__g0245(value);
    tmp.nm(tmp$ret$0);
  };
  protoOf(UShortSerializer).pi = function (encoder, value) {
    return this.r11(encoder, value instanceof UShort ? value.ii_1 : THROW_CCE());
  };
  protoOf(UShortSerializer).s11 = function (decoder) {
    // Inline function 'kotlin.toUShort' call
    var this_0 = decoder.ml(this.q11_1).el();
    return _UShort___init__impl__jigrne(this_0);
  };
  protoOf(UShortSerializer).qi = function (decoder) {
    return new UShort(this.s11(decoder));
  };
  var UShortSerializer_instance;
  function UShortSerializer_getInstance() {
    if (UShortSerializer_instance == null)
      new UShortSerializer();
    return UShortSerializer_instance;
  }
  function UByteSerializer() {
    UByteSerializer_instance = this;
    this.t11_1 = InlinePrimitiveDescriptor('kotlin.UByte', serializer_10(ByteCompanionObject_instance));
  }
  protoOf(UByteSerializer).oi = function () {
    return this.t11_1;
  };
  protoOf(UByteSerializer).u11 = function (encoder, value) {
    var tmp = encoder.vm(this.t11_1);
    // Inline function 'kotlin.UByte.toByte' call
    var tmp$ret$0 = _UByte___get_data__impl__jof9qr(value);
    tmp.mm(tmp$ret$0);
  };
  protoOf(UByteSerializer).pi = function (encoder, value) {
    return this.u11(encoder, value instanceof UByte ? value.eh_1 : THROW_CCE());
  };
  protoOf(UByteSerializer).v11 = function (decoder) {
    // Inline function 'kotlin.toUByte' call
    var this_0 = decoder.ml(this.t11_1).dl();
    return _UByte___init__impl__g9hnc4(this_0);
  };
  protoOf(UByteSerializer).qi = function (decoder) {
    return new UByte(this.v11(decoder));
  };
  var UByteSerializer_instance;
  function UByteSerializer_getInstance() {
    if (UByteSerializer_instance == null)
      new UByteSerializer();
    return UByteSerializer_instance;
  }
  function get_EmptySerializersModuleLegacyJs() {
    _init_properties_SerializersModule_kt__u78ha3();
    return EmptySerializersModule;
  }
  var EmptySerializersModule;
  function SerializersModule() {
  }
  protoOf(SerializersModule).kj = function (kClass, typeArgumentsSerializers, $super) {
    typeArgumentsSerializers = typeArgumentsSerializers === VOID ? emptyList() : typeArgumentsSerializers;
    return $super === VOID ? this.lj(kClass, typeArgumentsSerializers) : $super.lj.call(this, kClass, typeArgumentsSerializers);
  };
  function SerialModuleImpl(class2ContextualFactory, polyBase2Serializers, polyBase2DefaultSerializerProvider, polyBase2NamedSerializers, polyBase2DefaultDeserializerProvider, hasInterfaceContextualSerializers) {
    SerializersModule.call(this);
    this.x11_1 = class2ContextualFactory;
    this.y11_1 = polyBase2Serializers;
    this.z11_1 = polyBase2DefaultSerializerProvider;
    this.a12_1 = polyBase2NamedSerializers;
    this.b12_1 = polyBase2DefaultDeserializerProvider;
    this.c12_1 = hasInterfaceContextualSerializers;
  }
  protoOf(SerialModuleImpl).jj = function () {
    return this.c12_1;
  };
  protoOf(SerialModuleImpl).on = function (baseClass, value) {
    if (!baseClass.a9(value))
      return null;
    var tmp0_safe_receiver = this.y11_1.v1(baseClass);
    var tmp = tmp0_safe_receiver == null ? null : tmp0_safe_receiver.v1(getKClassFromExpression(value));
    var registered = (!(tmp == null) ? isInterface(tmp, SerializationStrategy) : false) ? tmp : null;
    if (!(registered == null))
      return registered;
    var tmp_0 = this.z11_1.v1(baseClass);
    var tmp1_safe_receiver = (!(tmp_0 == null) ? typeof tmp_0 === 'function' : false) ? tmp_0 : null;
    return tmp1_safe_receiver == null ? null : tmp1_safe_receiver(value);
  };
  protoOf(SerialModuleImpl).nn = function (baseClass, serializedClassName) {
    var tmp0_safe_receiver = this.a12_1.v1(baseClass);
    var tmp;
    if (tmp0_safe_receiver == null) {
      tmp = null;
    } else {
      // Inline function 'kotlin.collections.get' call
      tmp = (isInterface(tmp0_safe_receiver, KtMap) ? tmp0_safe_receiver : THROW_CCE()).v1(serializedClassName);
    }
    var tmp_0 = tmp;
    var registered = (!(tmp_0 == null) ? isInterface(tmp_0, KSerializer) : false) ? tmp_0 : null;
    if (!(registered == null))
      return registered;
    var tmp_1 = this.b12_1.v1(baseClass);
    var tmp1_safe_receiver = (!(tmp_1 == null) ? typeof tmp_1 === 'function' : false) ? tmp_1 : null;
    return tmp1_safe_receiver == null ? null : tmp1_safe_receiver(serializedClassName);
  };
  protoOf(SerialModuleImpl).lj = function (kClass, typeArgumentsSerializers) {
    var tmp0_safe_receiver = this.x11_1.v1(kClass);
    var tmp = tmp0_safe_receiver == null ? null : tmp0_safe_receiver.d12(typeArgumentsSerializers);
    return (tmp == null ? true : isInterface(tmp, KSerializer)) ? tmp : null;
  };
  protoOf(SerialModuleImpl).w11 = function (collector) {
    // Inline function 'kotlin.collections.forEach' call
    // Inline function 'kotlin.collections.iterator' call
    var _iterator__ex2g4s = this.x11_1.y1().g();
    while (_iterator__ex2g4s.h()) {
      var element = _iterator__ex2g4s.i();
      // Inline function 'kotlin.collections.component1' call
      var kclass = element.r1();
      // Inline function 'kotlin.collections.component2' call
      var serial = element.s1();
      if (serial instanceof Argless) {
        var tmp = isInterface(kclass, KClass) ? kclass : THROW_CCE();
        var tmp_0 = serial.g12_1;
        collector.h12(tmp, isInterface(tmp_0, KSerializer) ? tmp_0 : THROW_CCE());
      } else {
        if (serial instanceof WithTypeArguments) {
          collector.f12(kclass, serial.e12_1);
        } else {
          noWhenBranchMatchedException();
        }
      }
    }
    // Inline function 'kotlin.collections.forEach' call
    // Inline function 'kotlin.collections.iterator' call
    var _iterator__ex2g4s_0 = this.y11_1.y1().g();
    while (_iterator__ex2g4s_0.h()) {
      var element_0 = _iterator__ex2g4s_0.i();
      // Inline function 'kotlin.collections.component1' call
      var baseClass = element_0.r1();
      // Inline function 'kotlin.collections.component2' call
      var classMap = element_0.s1();
      // Inline function 'kotlin.collections.forEach' call
      // Inline function 'kotlin.collections.iterator' call
      var _iterator__ex2g4s_1 = classMap.y1().g();
      while (_iterator__ex2g4s_1.h()) {
        var element_1 = _iterator__ex2g4s_1.i();
        // Inline function 'kotlin.collections.component1' call
        var actualClass = element_1.r1();
        // Inline function 'kotlin.collections.component2' call
        var serializer = element_1.s1();
        var tmp_1 = isInterface(baseClass, KClass) ? baseClass : THROW_CCE();
        var tmp_2 = isInterface(actualClass, KClass) ? actualClass : THROW_CCE();
        // Inline function 'kotlinx.serialization.internal.cast' call
        var tmp$ret$11 = isInterface(serializer, KSerializer) ? serializer : THROW_CCE();
        collector.i12(tmp_1, tmp_2, tmp$ret$11);
      }
    }
    // Inline function 'kotlin.collections.forEach' call
    // Inline function 'kotlin.collections.iterator' call
    var _iterator__ex2g4s_2 = this.z11_1.y1().g();
    while (_iterator__ex2g4s_2.h()) {
      var element_2 = _iterator__ex2g4s_2.i();
      // Inline function 'kotlin.collections.component1' call
      var baseClass_0 = element_2.r1();
      // Inline function 'kotlin.collections.component2' call
      var provider = element_2.s1();
      var tmp_3 = isInterface(baseClass_0, KClass) ? baseClass_0 : THROW_CCE();
      collector.j12(tmp_3, typeof provider === 'function' ? provider : THROW_CCE());
    }
    // Inline function 'kotlin.collections.forEach' call
    // Inline function 'kotlin.collections.iterator' call
    var _iterator__ex2g4s_3 = this.b12_1.y1().g();
    while (_iterator__ex2g4s_3.h()) {
      var element_3 = _iterator__ex2g4s_3.i();
      // Inline function 'kotlin.collections.component1' call
      var baseClass_1 = element_3.r1();
      // Inline function 'kotlin.collections.component2' call
      var provider_0 = element_3.s1();
      var tmp_4 = isInterface(baseClass_1, KClass) ? baseClass_1 : THROW_CCE();
      collector.k12(tmp_4, typeof provider_0 === 'function' ? provider_0 : THROW_CCE());
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
  function SerializableWith(serializer) {
    this.l12_1 = serializer;
  }
  protoOf(SerializableWith).equals = function (other) {
    if (!(other instanceof SerializableWith))
      return false;
    var tmp0_other_with_cast = other instanceof SerializableWith ? other : THROW_CCE();
    if (!this.l12_1.equals(tmp0_other_with_cast.l12_1))
      return false;
    return true;
  };
  protoOf(SerializableWith).hashCode = function () {
    return imul(getStringHashCode('serializer'), 127) ^ this.l12_1.hashCode();
  };
  protoOf(SerializableWith).toString = function () {
    return '@kotlinx.serialization.SerializableWith(' + 'serializer=' + toString(this.l12_1) + ')';
  };
  function createCache(factory) {
    return new createCache$1(factory);
  }
  function createParametrizedCache(factory) {
    return new createParametrizedCache$1(factory);
  }
  function isInterface_0(_this__u8e3s4) {
    return get_isInterface(_this__u8e3s4);
  }
  function initBuiltins() {
    return mapOf([to(PrimitiveClasses_getInstance().aa(), serializer_0(StringCompanionObject_instance)), to(getKClass(Char), serializer_1(Companion_getInstance_1())), to(PrimitiveClasses_getInstance().da(), CharArraySerializer()), to(PrimitiveClasses_getInstance().y9(), serializer_2(DoubleCompanionObject_instance)), to(PrimitiveClasses_getInstance().ja(), DoubleArraySerializer()), to(PrimitiveClasses_getInstance().x9(), serializer_3(FloatCompanionObject_instance)), to(PrimitiveClasses_getInstance().ia(), FloatArraySerializer()), to(getKClass(Long), serializer_4(Companion_getInstance_2())), to(PrimitiveClasses_getInstance().ha(), LongArraySerializer()), to(getKClass(ULong), serializer_5(Companion_getInstance_3())), to(getKClass(ULongArray), ULongArraySerializer()), to(PrimitiveClasses_getInstance().w9(), serializer_6(IntCompanionObject_instance)), to(PrimitiveClasses_getInstance().ga(), IntArraySerializer()), to(getKClass(UInt), serializer_7(Companion_getInstance_4())), to(getKClass(UIntArray), UIntArraySerializer()), to(PrimitiveClasses_getInstance().v9(), serializer_8(ShortCompanionObject_instance)), to(PrimitiveClasses_getInstance().fa(), ShortArraySerializer()), to(getKClass(UShort), serializer_9(Companion_getInstance_5())), to(getKClass(UShortArray), UShortArraySerializer()), to(PrimitiveClasses_getInstance().u9(), serializer_10(ByteCompanionObject_instance)), to(PrimitiveClasses_getInstance().ea(), ByteArraySerializer()), to(getKClass(UByte), serializer_11(Companion_getInstance_6())), to(getKClass(UByteArray), UByteArraySerializer()), to(PrimitiveClasses_getInstance().t9(), serializer_12(BooleanCompanionObject_instance)), to(PrimitiveClasses_getInstance().ca(), BooleanArraySerializer()), to(getKClass(Unit), serializer_13(Unit_instance)), to(PrimitiveClasses_getInstance().s9(), NothingSerializer()), to(getKClass(Duration), serializer_14(Companion_getInstance())), to(getKClass(Uuid), serializer_15(Companion_getInstance_0()))]);
  }
  function get_isInterface(_this__u8e3s4) {
    if (_this__u8e3s4 === PrimitiveClasses_getInstance().s9())
      return false;
    // Inline function 'kotlin.js.asDynamic' call
    var tmp0_safe_receiver = get_js(_this__u8e3s4).$metadata$;
    return (tmp0_safe_receiver == null ? null : tmp0_safe_receiver.kind) == 'interface';
  }
  function compiledSerializerImpl(_this__u8e3s4) {
    var tmp0_elvis_lhs = constructSerializerForGivenTypeArgs(_this__u8e3s4, []);
    var tmp;
    if (tmp0_elvis_lhs == null) {
      var tmp_0;
      if (_this__u8e3s4 === PrimitiveClasses_getInstance().s9()) {
        tmp_0 = NothingSerializer_getInstance();
      } else {
        // Inline function 'kotlin.js.asDynamic' call
        var tmp1_safe_receiver = get_js(_this__u8e3s4).Companion;
        tmp_0 = tmp1_safe_receiver == null ? null : tmp1_safe_receiver.serializer();
      }
      var tmp_1 = tmp_0;
      tmp = (!(tmp_1 == null) ? isInterface(tmp_1, KSerializer) : false) ? tmp_1 : null;
    } else {
      tmp = tmp0_elvis_lhs;
    }
    return tmp;
  }
  function platformSpecificSerializerNotRegistered(_this__u8e3s4) {
    throw SerializationException_init_$Create$_0(notRegisteredMessage(_this__u8e3s4) + 'To get enum serializer on Kotlin/JS, it should be annotated with @Serializable annotation.');
  }
  function isReferenceArray(rootClass) {
    return rootClass.equals(PrimitiveClasses_getInstance().z9());
  }
  function constructSerializerForGivenTypeArgs(_this__u8e3s4, args) {
    var tmp;
    try {
      // Inline function 'kotlin.reflect.findAssociatedObject' call
      var assocObject = findAssociatedObject(_this__u8e3s4, getKClass(SerializableWith));
      var tmp_0;
      if (!(assocObject == null) ? isInterface(assocObject, KSerializer) : false) {
        tmp_0 = isInterface(assocObject, KSerializer) ? assocObject : THROW_CCE();
      } else {
        if (!(assocObject == null) ? isInterface(assocObject, SerializerFactory) : false) {
          var tmp_1 = assocObject.du(args.slice());
          tmp_0 = isInterface(tmp_1, KSerializer) ? tmp_1 : THROW_CCE();
        } else {
          tmp_0 = null;
        }
      }
      tmp = tmp_0;
    } catch ($p) {
      var tmp_2;
      var e = $p;
      tmp_2 = null;
      tmp = tmp_2;
    }
    return tmp;
  }
  function toNativeArrayImpl(_this__u8e3s4, eClass) {
    // Inline function 'kotlin.collections.toTypedArray' call
    return copyToArray(_this__u8e3s4);
  }
  function getChecked(_this__u8e3s4, index) {
    if (!(0 <= index ? index <= (_this__u8e3s4.length - 1 | 0) : false))
      throw IndexOutOfBoundsException_init_$Create$('Index ' + index + ' out of bounds ' + get_indices(_this__u8e3s4).toString());
    return _this__u8e3s4[index];
  }
  function getChecked_0(_this__u8e3s4, index) {
    if (!(0 <= index ? index <= (_this__u8e3s4.length - 1 | 0) : false))
      throw IndexOutOfBoundsException_init_$Create$('Index ' + index + ' out of bounds ' + get_indices_0(_this__u8e3s4).toString());
    return _this__u8e3s4[index];
  }
  function createCache$1($factory) {
    this.m12_1 = $factory;
  }
  protoOf(createCache$1).mj = function (key) {
    return this.m12_1(key);
  };
  function createParametrizedCache$1($factory) {
    this.n12_1 = $factory;
  }
  protoOf(createParametrizedCache$1).nj = function (key, types) {
    // Inline function 'kotlin.runCatching' call
    var tmp;
    try {
      // Inline function 'kotlin.Companion.success' call
      var value = this.n12_1(key, types);
      tmp = _Result___init__impl__xyqfz8(value);
    } catch ($p) {
      var tmp_0;
      if ($p instanceof Error) {
        var e = $p;
        // Inline function 'kotlin.Companion.failure' call
        tmp_0 = _Result___init__impl__xyqfz8(createFailure(e));
      } else {
        throw $p;
      }
      tmp = tmp_0;
    }
    return tmp;
  };
  //region block: post-declaration
  protoOf(SerialDescriptorImpl).oj = get_isNullable;
  protoOf(SerialDescriptorImpl).uj = get_isInline;
  protoOf(AbstractDecoder).cm = decodeSerializableElement$default;
  protoOf(AbstractDecoder).ol = decodeSerializableValue;
  protoOf(AbstractDecoder).fm = decodeSequentially;
  protoOf(AbstractDecoder).hm = decodeCollectionSize;
  protoOf(AbstractEncoder).kn = encodeNotNullMark;
  protoOf(AbstractEncoder).ln = beginCollection;
  protoOf(AbstractEncoder).hn = encodeSerializableValue;
  protoOf(AbstractEncoder).jn = encodeNullableSerializableValue;
  protoOf(AbstractEncoder).mn = shouldEncodeElementDefault;
  protoOf(ListLikeDescriptor).oj = get_isNullable;
  protoOf(ListLikeDescriptor).uj = get_isInline;
  protoOf(ListLikeDescriptor).wj = get_annotations;
  protoOf(MapLikeDescriptor).oj = get_isNullable;
  protoOf(MapLikeDescriptor).uj = get_isInline;
  protoOf(MapLikeDescriptor).wj = get_annotations;
  protoOf(PluginGeneratedSerialDescriptor).oj = get_isNullable;
  protoOf(PluginGeneratedSerialDescriptor).uj = get_isInline;
  protoOf(InlinePrimitiveDescriptor$1).tt = typeParametersSerializers;
  protoOf(NothingSerialDescriptor).oj = get_isNullable;
  protoOf(NothingSerialDescriptor).uj = get_isInline;
  protoOf(NothingSerialDescriptor).wj = get_annotations;
  protoOf(PrimitiveSerialDescriptor_0).oj = get_isNullable;
  protoOf(PrimitiveSerialDescriptor_0).uj = get_isInline;
  protoOf(PrimitiveSerialDescriptor_0).wj = get_annotations;
  protoOf(TaggedDecoder).cm = decodeSerializableElement$default;
  protoOf(TaggedDecoder).ol = decodeSerializableValue;
  protoOf(TaggedDecoder).fm = decodeSequentially;
  protoOf(TaggedDecoder).hm = decodeCollectionSize;
  //endregion
  //region block: exports
  _.$_$ = _.$_$ || {};
  _.$_$.a = SerializationException_init_$Init$_0;
  _.$_$.b = SerializationException_init_$Create$_0;
  _.$_$.c = UnknownFieldException_init_$Create$;
  _.$_$.d = SEALED_getInstance;
  _.$_$.e = STRING_getInstance;
  _.$_$.f = CONTEXTUAL_getInstance;
  _.$_$.g = ENUM_getInstance;
  _.$_$.h = CLASS_getInstance;
  _.$_$.i = LIST_getInstance;
  _.$_$.j = MAP_getInstance;
  _.$_$.k = OBJECT_getInstance;
  _.$_$.l = BooleanSerializer_getInstance;
  _.$_$.m = IntSerializer_getInstance;
  _.$_$.n = LongSerializer_getInstance;
  _.$_$.o = StringSerializer_getInstance;
  _.$_$.p = ListSerializer;
  _.$_$.q = MapSerializer;
  _.$_$.r = get_nullable;
  _.$_$.s = serializer_0;
  _.$_$.t = serializer_9;
  _.$_$.u = serializer_7;
  _.$_$.v = serializer_11;
  _.$_$.w = serializer_5;
  _.$_$.x = PolymorphicKind;
  _.$_$.y = PrimitiveKind;
  _.$_$.z = PrimitiveSerialDescriptor;
  _.$_$.a1 = get_annotations;
  _.$_$.b1 = get_isInline;
  _.$_$.c1 = get_isNullable;
  _.$_$.d1 = SerialDescriptor;
  _.$_$.e1 = ENUM;
  _.$_$.f1 = buildSerialDescriptor;
  _.$_$.g1 = getContextualDescriptor;
  _.$_$.h1 = AbstractDecoder;
  _.$_$.i1 = AbstractEncoder;
  _.$_$.j1 = CompositeDecoder;
  _.$_$.k1 = CompositeEncoder;
  _.$_$.l1 = Decoder;
  _.$_$.m1 = Encoder;
  _.$_$.n1 = AbstractPolymorphicSerializer;
  _.$_$.o1 = ArrayListSerializer;
  _.$_$.p1 = ElementMarker;
  _.$_$.q1 = typeParametersSerializers;
  _.$_$.r1 = GeneratedSerializer;
  _.$_$.s1 = InlinePrimitiveDescriptor;
  _.$_$.t1 = LinkedHashMapSerializer;
  _.$_$.u1 = NamedValueDecoder;
  _.$_$.v1 = PluginGeneratedSerialDescriptor;
  _.$_$.w1 = SerializerFactory;
  _.$_$.x1 = createSimpleEnumSerializer;
  _.$_$.y1 = jsonCachedSerialNames;
  _.$_$.z1 = throwMissingFieldException;
  _.$_$.a2 = EmptySerializersModule_0;
  _.$_$.b2 = contextual;
  _.$_$.c2 = SerializersModuleCollector;
  _.$_$.d2 = DeserializationStrategy;
  _.$_$.e2 = KSerializer;
  _.$_$.f2 = MissingFieldException;
  _.$_$.g2 = SealedClassSerializer;
  _.$_$.h2 = SerializationException;
  _.$_$.i2 = SerializationStrategy;
  _.$_$.j2 = findPolymorphicSerializer_0;
  _.$_$.k2 = findPolymorphicSerializer;
  _.$_$.l2 = serializer;
  //endregion
  return _;
}(module.exports, require('./kotlin-kotlin-stdlib.js')));

//# sourceMappingURL=kotlinx-serialization-kotlinx-serialization-core.js.map
