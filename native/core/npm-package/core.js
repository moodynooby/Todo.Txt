(function (_, kotlin_kotlin, kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core, kotlin_org_jetbrains_kotlinx_kotlinx_serialization_json) {
  'use strict';
  //region block: imports
  var imul = Math.imul;
  var plus = kotlin_kotlin.$_$.q5;
  var distinct = kotlin_kotlin.$_$.y4;
  var sorted = kotlin_kotlin.$_$.u5;
  var VOID = kotlin_kotlin.$_$.f;
  var LinkedHashMap_init_$Create$ = kotlin_kotlin.$_$.s;
  var Unit_instance = kotlin_kotlin.$_$.r3;
  var toList = kotlin_kotlin.$_$.y5;
  var protoOf = kotlin_kotlin.$_$.t7;
  var initMetadataForObject = kotlin_kotlin.$_$.b7;
  var downTo = kotlin_kotlin.$_$.c8;
  var collectionSizeOrDefault = kotlin_kotlin.$_$.k4;
  var ArrayList_init_$Create$ = kotlin_kotlin.$_$.i;
  var toSet = kotlin_kotlin.$_$.c6;
  var Collection = kotlin_kotlin.$_$.t3;
  var isInterface = kotlin_kotlin.$_$.j7;
  var checkCountOverflow = kotlin_kotlin.$_$.i4;
  var numberToInt = kotlin_kotlin.$_$.q7;
  var listOf = kotlin_kotlin.$_$.m5;
  var checkIndexOverflow = kotlin_kotlin.$_$.j4;
  var to = kotlin_kotlin.$_$.ta;
  var until = kotlin_kotlin.$_$.e8;
  var compareTo = kotlin_kotlin.$_$.q6;
  var toMutableList = kotlin_kotlin.$_$.b6;
  var split = kotlin_kotlin.$_$.u8;
  var toInt = kotlin_kotlin.$_$.c9;
  var Regex_init_$Create$ = kotlin_kotlin.$_$.w;
  var RegexOption_IGNORE_CASE_getInstance = kotlin_kotlin.$_$.g;
  var Regex_init_$Create$_0 = kotlin_kotlin.$_$.x;
  var toIntOrNull = kotlin_kotlin.$_$.b9;
  var _Char___init__impl__6a9atx = kotlin_kotlin.$_$.j1;
  var padStart = kotlin_kotlin.$_$.r8;
  var getOrNull = kotlin_kotlin.$_$.c5;
  var isBlank = kotlin_kotlin.$_$.p8;
  var startsWith = kotlin_kotlin.$_$.v8;
  var map = kotlin_kotlin.$_$.i8;
  var toSet_0 = kotlin_kotlin.$_$.j8;
  var contains = kotlin_kotlin.$_$.l8;
  var charArrayOf = kotlin_kotlin.$_$.l6;
  var trimEnd = kotlin_kotlin.$_$.j9;
  var contains_0 = kotlin_kotlin.$_$.k8;
  var ArrayList_init_$Create$_0 = kotlin_kotlin.$_$.j;
  var addAll = kotlin_kotlin.$_$.f4;
  var mapCapacity = kotlin_kotlin.$_$.n5;
  var coerceAtLeast = kotlin_kotlin.$_$.z7;
  var LinkedHashMap_init_$Create$_0 = kotlin_kotlin.$_$.r;
  var ensureNotNull = kotlin_kotlin.$_$.ka;
  var StringSerializer_getInstance = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.o;
  var ArrayListSerializer = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.o1;
  var LazyThreadSafetyMode_PUBLICATION_getInstance = kotlin_kotlin.$_$.h;
  var lazy = kotlin_kotlin.$_$.oa;
  var initMetadataForCompanion = kotlin_kotlin.$_$.x6;
  var PluginGeneratedSerialDescriptor = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.v1;
  var emptyList = kotlin_kotlin.$_$.z4;
  var equals = kotlin_kotlin.$_$.r6;
  var THROW_CCE = kotlin_kotlin.$_$.w9;
  var UnknownFieldException_init_$Create$ = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.c;
  var IntSerializer_getInstance = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.m;
  var BooleanSerializer_getInstance = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.l;
  var get_nullable = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.r;
  var typeParametersSerializers = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.q1;
  var GeneratedSerializer = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.r1;
  var throwMissingFieldException = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.z1;
  var objectCreate = kotlin_kotlin.$_$.s7;
  var toString = kotlin_kotlin.$_$.x7;
  var getStringHashCode = kotlin_kotlin.$_$.u6;
  var getBooleanHashCode = kotlin_kotlin.$_$.s6;
  var hashCode = kotlin_kotlin.$_$.v6;
  var initMetadataForClass = kotlin_kotlin.$_$.w6;
  var LinkedHashMapSerializer = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.t1;
  var emptyMap = kotlin_kotlin.$_$.a5;
  var Long = kotlin_kotlin.$_$.t9;
  var LongSerializer_getInstance = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.n;
  var createSimpleEnumSerializer = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.x1;
  var SerializerFactory = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.w1;
  var enumEntries = kotlin_kotlin.$_$.g6;
  var Enum = kotlin_kotlin.$_$.r9;
  var take = kotlin_kotlin.$_$.v5;
  var NoSuchElementException_init_$Create$ = kotlin_kotlin.$_$.g1;
  var average = kotlin_kotlin.$_$.h4;
  var getKClass = kotlin_kotlin.$_$.e;
  var arrayOf = kotlin_kotlin.$_$.ha;
  var createKType = kotlin_kotlin.$_$.b;
  var serializer = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.l2;
  var KSerializer = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_core.$_$.e2;
  var KtList = kotlin_kotlin.$_$.y3;
  var Comparable = kotlin_kotlin.$_$.o9;
  var PrimitiveClasses_getInstance = kotlin_kotlin.$_$.h3;
  var createInvariantKTypeProjection = kotlin_kotlin.$_$.a;
  var println = kotlin_kotlin.$_$.h6;
  var Json = kotlin_org_jetbrains_kotlinx_kotlinx_serialization_json.$_$.a;
  var numberToLong = kotlin_kotlin.$_$.r7;
  //endregion
  //region block: pre-declaration
  initMetadataForObject(HabitMerge, 'HabitMerge');
  initMetadataForObject(HabitUtils, 'HabitUtils');
  initMetadataForObject(TodoParser, 'TodoParser');
  initMetadataForCompanion(Companion);
  initMetadataForObject($serializer, '$serializer', VOID, VOID, [GeneratedSerializer]);
  initMetadataForClass(Task, 'Task', VOID, VOID, VOID, VOID, VOID, {0: $serializer_getInstance});
  initMetadataForCompanion(Companion_0);
  initMetadataForObject($serializer_0, '$serializer', VOID, VOID, [GeneratedSerializer]);
  initMetadataForClass(ParsedTodoContent, 'ParsedTodoContent', VOID, VOID, VOID, VOID, VOID, {0: $serializer_getInstance_0});
  initMetadataForCompanion(Companion_1);
  initMetadataForObject($serializer_1, '$serializer', VOID, VOID, [GeneratedSerializer]);
  initMetadataForClass(Habit, 'Habit', VOID, VOID, VOID, VOID, VOID, {0: $serializer_getInstance_1});
  initMetadataForCompanion(Companion_2, VOID, [SerializerFactory]);
  initMetadataForClass(HabitColor, 'HabitColor', VOID, Enum, VOID, VOID, VOID, {0: Companion_getInstance_2});
  initMetadataForCompanion(Companion_3);
  initMetadataForObject($serializer_2, '$serializer', VOID, VOID, [GeneratedSerializer]);
  initMetadataForClass(WidgetTaskProjection, 'WidgetTaskProjection', VOID, VOID, VOID, VOID, VOID, {0: $serializer_getInstance_2});
  initMetadataForCompanion(Companion_4);
  initMetadataForObject($serializer_3, '$serializer', VOID, VOID, [GeneratedSerializer]);
  initMetadataForClass(WidgetHabitProjection, 'WidgetHabitProjection', VOID, VOID, VOID, VOID, VOID, {0: $serializer_getInstance_3});
  initMetadataForCompanion(Companion_5);
  initMetadataForObject($serializer_4, '$serializer', VOID, VOID, [GeneratedSerializer]);
  initMetadataForClass(WidgetMomentumProjection, 'WidgetMomentumProjection', WidgetMomentumProjection, VOID, VOID, VOID, VOID, {0: $serializer_getInstance_4});
  initMetadataForCompanion(Companion_6);
  initMetadataForObject($serializer_5, '$serializer', VOID, VOID, [GeneratedSerializer]);
  initMetadataForClass(WidgetPayloadProjection, 'WidgetPayloadProjection', VOID, VOID, VOID, VOID, VOID, {0: $serializer_getInstance_5});
  initMetadataForObject(WidgetData, 'WidgetData');
  //endregion
  function combine($this, existing, incoming) {
    var winner = incoming.d1e_1.y(existing.d1e_1) >= 0 ? incoming : existing;
    var tmp = sorted(distinct(plus(existing.a1e_1, incoming.a1e_1)));
    var tmp0 = existing.d1e_1;
    // Inline function 'kotlin.comparisons.maxOf' call
    var b = incoming.d1e_1;
    var tmp$ret$0 = tmp0.y(b) >= 0 ? tmp0 : b;
    return winner.e1e(VOID, VOID, VOID, VOID, VOID, tmp, VOID, VOID, tmp$ret$0);
  }
  function HabitMerge() {
  }
  protoOf(HabitMerge).f1e = function (local, remote) {
    var merged = LinkedHashMap_init_$Create$();
    // Inline function 'kotlin.collections.forEach' call
    var _iterator__ex2g4s = local.g();
    while (_iterator__ex2g4s.h()) {
      var element = _iterator__ex2g4s.i();
      // Inline function 'kotlin.collections.set' call
      var key = element.v1d_1;
      merged.c2(key, element);
    }
    // Inline function 'kotlin.collections.forEach' call
    var _iterator__ex2g4s_0 = remote.g();
    while (_iterator__ex2g4s_0.h()) {
      var element_0 = _iterator__ex2g4s_0.i();
      var existing = merged.v1(element_0.v1d_1);
      var tmp1 = element_0.v1d_1;
      var tmp;
      if (existing == null) {
        tmp = element_0;
      } else {
        tmp = combine(HabitMerge_instance, existing, element_0);
      }
      // Inline function 'kotlin.collections.set' call
      var value = tmp;
      merged.c2(tmp1, value);
    }
    return toList(merged.x1());
  };
  var HabitMerge_instance;
  function HabitMerge_getInstance() {
    return HabitMerge_instance;
  }
  function HabitUtils() {
  }
  protoOf(HabitUtils).g1e = function () {
    return todayString();
  };
  protoOf(HabitUtils).h1e = function (count) {
    var today = todayString();
    // Inline function 'kotlin.collections.map' call
    var this_0 = downTo(count - 1 | 0, 0);
    // Inline function 'kotlin.collections.mapTo' call
    var destination = ArrayList_init_$Create$(collectionSizeOrDefault(this_0, 10));
    var inductionVariable = this_0.s_1;
    var last = this_0.t_1;
    var step = this_0.u_1;
    if (step > 0 && inductionVariable <= last || (step < 0 && last <= inductionVariable))
      do {
        var item = inductionVariable;
        inductionVariable = inductionVariable + step | 0;
        var it = item;
        var tmp$ret$0 = addDaysString(today, -it | 0);
        destination.e(tmp$ret$0);
      }
       while (!(item === last));
    return destination;
  };
  protoOf(HabitUtils).i1e = function (habit) {
    var completed = toSet(habit.a1e_1);
    var cursor = todayString();
    if (!completed.p1(cursor))
      cursor = addDaysString(cursor, -1);
    var streak = 0;
    while (completed.p1(cursor)) {
      streak = streak + 1 | 0;
      cursor = addDaysString(cursor, -1);
    }
    return streak;
  };
  protoOf(HabitUtils).j1e = function (habit) {
    var dates = sorted(habit.a1e_1);
    var best = 0;
    var current = 0;
    var previous = null;
    var _iterator__ex2g4s = dates.g();
    while (_iterator__ex2g4s.h()) {
      var date = _iterator__ex2g4s.i();
      var tmp;
      if (previous == null) {
        tmp = 1;
      } else if (daysBetween(previous, date) === 1) {
        tmp = current + 1 | 0;
      } else {
        tmp = 1;
      }
      current = tmp;
      if (current > best)
        best = current;
      previous = date;
    }
    return best;
  };
  protoOf(HabitUtils).k1e = function (habit, days) {
    var dates = this.h1e(days);
    var tmp$ret$0;
    $l$block: {
      // Inline function 'kotlin.collections.count' call
      var tmp;
      if (isInterface(dates, Collection)) {
        tmp = dates.p();
      } else {
        tmp = false;
      }
      if (tmp) {
        tmp$ret$0 = 0;
        break $l$block;
      }
      var count = 0;
      var _iterator__ex2g4s = dates.g();
      while (_iterator__ex2g4s.h()) {
        var element = _iterator__ex2g4s.i();
        if (habit.a1e_1.p1(element)) {
          count = count + 1 | 0;
          checkCountOverflow(count);
        }
      }
      tmp$ret$0 = count;
    }
    var hits = tmp$ret$0;
    return numberToInt(hits / days * 100);
  };
  protoOf(HabitUtils).l1e = function (habit, days, $super) {
    days = days === VOID ? 28 : days;
    return $super === VOID ? this.k1e(habit, days) : $super.k1e.call(this, habit, days);
  };
  protoOf(HabitUtils).m1e = function (habit) {
    var days = this.h1e(7);
    var names = listOf(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
    // Inline function 'kotlin.collections.mapIndexed' call
    // Inline function 'kotlin.collections.mapIndexedTo' call
    var destination = ArrayList_init_$Create$(collectionSizeOrDefault(days, 10));
    var index = 0;
    var _iterator__ex2g4s = days.g();
    while (_iterator__ex2g4s.h()) {
      var item = _iterator__ex2g4s.i();
      var _unary__edvuaz = index;
      index = _unary__edvuaz + 1 | 0;
      checkIndexOverflow(_unary__edvuaz);
      var tmp$ret$0 = to(names.k(dayOfWeek(item)), habit.a1e_1.p1(item));
      destination.e(tmp$ret$0);
    }
    return destination;
  };
  protoOf(HabitUtils).n1e = function (habit, weeks) {
    var today = todayString();
    var start = addDaysString(today, -(imul(weeks, 7) - 1 | 0) | 0);
    var completed = toSet(habit.a1e_1);
    // Inline function 'kotlin.collections.map' call
    var this_0 = until(0, weeks);
    // Inline function 'kotlin.collections.mapTo' call
    var destination = ArrayList_init_$Create$(collectionSizeOrDefault(this_0, 10));
    var inductionVariable = this_0.s_1;
    var last = this_0.t_1;
    if (inductionVariable <= last)
      do {
        var item = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        var week = item;
        // Inline function 'kotlin.collections.map' call
        var this_1 = until(0, 7);
        // Inline function 'kotlin.collections.mapTo' call
        var destination_0 = ArrayList_init_$Create$(collectionSizeOrDefault(this_1, 10));
        var inductionVariable_0 = this_1.s_1;
        var last_0 = this_1.t_1;
        if (inductionVariable_0 <= last_0)
          do {
            var item_0 = inductionVariable_0;
            inductionVariable_0 = inductionVariable_0 + 1 | 0;
            var day = item_0;
            var date = addDaysString(start, imul(week, 7) + day | 0);
            var tmp$ret$0 = compareTo(date, today) > 0 ? null : date;
            destination_0.e(tmp$ret$0);
          }
           while (!(item_0 === last_0));
        destination.e(destination_0);
      }
       while (!(item === last));
    return destination;
  };
  protoOf(HabitUtils).o1e = function (habit, weeks, $super) {
    weeks = weeks === VOID ? 12 : weeks;
    return $super === VOID ? this.n1e(habit, weeks) : $super.n1e.call(this, habit, weeks);
  };
  protoOf(HabitUtils).p1e = function (habit, date) {
    var dates = toMutableList(habit.a1e_1);
    if (dates.p1(date))
      dates.z1(date);
    else
      dates.e(date);
    return habit.e1e(VOID, VOID, VOID, VOID, VOID, dates, VOID, VOID, currentTimeMillis());
  };
  var HabitUtils_instance;
  function HabitUtils_getInstance() {
    return HabitUtils_instance;
  }
  function daysBetween(a, b) {
    return daysBetween$julian(b) - daysBetween$julian(a) | 0;
  }
  function dayOfWeek(isoDate) {
    var parts = split(isoDate, ['-']);
    var year = toInt(parts.k(0));
    var month = toInt(parts.k(1));
    var day = toInt(parts.k(2));
    var m = month <= 2 ? month + 12 | 0 : month;
    var y = month <= 2 ? year - 1 | 0 : year;
    var k = y % 100 | 0;
    var j = y / 100 | 0;
    var zeller = (((((day + (imul(26, m + 1 | 0) / 10 | 0) | 0) + k | 0) + (k / 4 | 0) | 0) + (j / 4 | 0) | 0) + imul(5, j) | 0) % 7 | 0;
    return (zeller + 5 | 0) % 7 | 0;
  }
  function daysBetween$julian(date) {
    var parts = split(date, ['-']);
    var year = toInt(parts.k(0));
    var month = toInt(parts.k(1));
    var day = toInt(parts.k(2));
    var y = year - (month <= 2 ? 1 : 0) | 0;
    var m = (month + 9 | 0) % 12 | 0;
    var c = y / 100 | 0;
    var yy = y % 100 | 0;
    return ((((imul(365, y) + (yy / 4 | 0) | 0) - (c / 4 | 0) | 0) + (imul(c, 3652425) / 10000 | 0) | 0) + ((imul(m, 979) + 29 | 0) / 30 | 0) | 0) + day | 0;
  }
  function parseRelativeDate($this, value, today, tomorrow, yesterday) {
    var tmp;
    if (value === 'today' || value === 'now') {
      tmp = today;
    } else if (value === 'tomorrow') {
      tmp = tomorrow;
    } else if (value === 'yesterday') {
      tmp = yesterday;
    } else if ($this.q1e_1.cb(value)) {
      tmp = value;
    } else {
      var tmp0_safe_receiver = $this.r1e_1.gb(value);
      var tmp_0;
      if (tmp0_safe_receiver == null) {
        tmp_0 = null;
      } else {
        // Inline function 'kotlin.let' call
        tmp_0 = addDaysString(today, toInt(tmp0_safe_receiver.zb().k(1)));
      }
      tmp = tmp_0;
    }
    return tmp;
  }
  function TodoParser$parseTodoLine$lambda(it) {
    return it.zb().k(1);
  }
  function TodoParser$parseTodoLine$lambda_0(it) {
    return it.zb().k(1);
  }
  function TodoParser() {
    TodoParser_instance = this;
    this.q1e_1 = Regex_init_$Create$('^\\d{4}-\\d{2}-\\d{2}$');
    this.r1e_1 = Regex_init_$Create$('([+-]\\d+)d?');
    this.s1e_1 = Regex_init_$Create$('^\\d{1,2}:\\d{2}(:\\d{2})?$');
    this.t1e_1 = Regex_init_$Create$('^-?\\[[ xX]\\]\\s');
    this.u1e_1 = Regex_init_$Create$_0('^-?\\[x\\]\\s', RegexOption_IGNORE_CASE_getInstance());
    this.v1e_1 = Regex_init_$Create$_0('^x\\s', RegexOption_IGNORE_CASE_getInstance());
    this.w1e_1 = Regex_init_$Create$('^\\(([A-Z])\\)\\s');
    this.x1e_1 = Regex_init_$Create$('(?<!\\w)\\+([A-Za-z][\\w.-]*)');
    this.y1e_1 = Regex_init_$Create$('(?<![\\w.])@([A-Za-z][\\w.-]*)');
    this.z1e_1 = Regex_init_$Create$('due:([^\\sT@]+)(?:T(\\d{1,2}:\\d{2}(?::\\d{2})?))?(?:@([A-Za-z][\\w-]*))?(?:@(\\d{1,2}:\\d{2}(?::\\d{2})?))?');
    this.a1f_1 = Regex_init_$Create$('due:(\\S+)');
    this.b1f_1 = Regex_init_$Create$('due:[T@](\\d{1,2}:\\d{2}(?::\\d{2})?)');
  }
  protoOf(TodoParser).g1e = function () {
    return todayString();
  };
  protoOf(TodoParser).c1f = function () {
    return addDaysString(this.g1e(), 1);
  };
  protoOf(TodoParser).d1f = function () {
    return addDaysString(this.g1e(), -1);
  };
  protoOf(TodoParser).e1f = function (raw) {
    var parts = split(raw, [':']);
    if (parts.j() < 2)
      return raw;
    var tmp0_safe_receiver = toIntOrNull(parts.k(0));
    var tmp1_safe_receiver = tmp0_safe_receiver == null ? null : tmp0_safe_receiver.toString();
    var tmp2_elvis_lhs = tmp1_safe_receiver == null ? null : padStart(tmp1_safe_receiver, 2, _Char___init__impl__6a9atx(48));
    var tmp;
    if (tmp2_elvis_lhs == null) {
      return raw;
    } else {
      tmp = tmp2_elvis_lhs;
    }
    var hh = tmp;
    var tmp3_safe_receiver = toIntOrNull(parts.k(1));
    var tmp4_safe_receiver = tmp3_safe_receiver == null ? null : tmp3_safe_receiver.toString();
    var tmp5_elvis_lhs = tmp4_safe_receiver == null ? null : padStart(tmp4_safe_receiver, 2, _Char___init__impl__6a9atx(48));
    var tmp_0;
    if (tmp5_elvis_lhs == null) {
      return raw;
    } else {
      tmp_0 = tmp5_elvis_lhs;
    }
    var mm = tmp_0;
    return hh + ':' + mm;
  };
  protoOf(TodoParser).f1f = function (trimmed, id) {
    var hasCheckboxMarker = this.t1e_1.cb(trimmed);
    var isChecked = hasCheckboxMarker && this.u1e_1.cb(trimmed);
    var hasXPrefix = !hasCheckboxMarker && this.v1e_1.cb(trimmed);
    var tmp;
    if (hasCheckboxMarker) {
      tmp = this.t1e_1.hb(trimmed, '');
    } else {
      tmp = trimmed;
    }
    var cleanText = tmp;
    var completed = isChecked || hasXPrefix;
    var task = new Task(id, cleanText, trimmed, completed);
    if (startsWith(cleanText, '(')) {
      var tmp0_safe_receiver = this.w1e_1.db(cleanText);
      var tmp1_safe_receiver = tmp0_safe_receiver == null ? null : tmp0_safe_receiver.zb();
      var tmp2_safe_receiver = tmp1_safe_receiver == null ? null : getOrNull(tmp1_safe_receiver, 1);
      var tmp_0;
      if (tmp2_safe_receiver == null) {
        tmp_0 = null;
      } else {
        // Inline function 'kotlin.takeIf' call
        var tmp_1;
        // Inline function 'kotlin.text.isNotBlank' call
        if (!isBlank(tmp2_safe_receiver)) {
          tmp_1 = tmp2_safe_receiver;
        } else {
          tmp_1 = null;
        }
        tmp_0 = tmp_1;
      }
      var tmp3_safe_receiver = tmp_0;
      if (tmp3_safe_receiver == null)
        null;
      else {
        // Inline function 'kotlin.let' call
        task = task.p1f(VOID, VOID, VOID, VOID, tmp3_safe_receiver);
      }
    }
    if (contains(cleanText, _Char___init__impl__6a9atx(43))) {
      var tmp_2 = task;
      var tmp_3 = this.x1e_1.fb(cleanText);
      task = tmp_2.p1f(VOID, VOID, VOID, VOID, VOID, toList(toSet_0(map(tmp_3, TodoParser$parseTodoLine$lambda))));
    }
    if (contains(cleanText, _Char___init__impl__6a9atx(64))) {
      var tmp_4 = task;
      var tmp_5 = this.y1e_1.fb(cleanText);
      task = tmp_4.p1f(VOID, VOID, VOID, VOID, VOID, VOID, toList(toSet_0(map(tmp_5, TodoParser$parseTodoLine$lambda_0))));
    }
    if (contains_0(cleanText, 'due:')) {
      var dueMatch = this.z1e_1.db(cleanText);
      if (!(dueMatch == null)) {
        // Inline function 'kotlin.text.lowercase' call
        // Inline function 'kotlin.js.asDynamic' call
        var value = dueMatch.zb().k(1).toLowerCase();
        // Inline function 'kotlin.text.ifBlank' call
        var this_0 = dueMatch.zb().k(2);
        var tmp_6;
        if (isBlank(this_0)) {
          tmp_6 = dueMatch.zb().k(4);
        } else {
          tmp_6 = this_0;
        }
        var timeRaw = tmp_6;
        var today = this.g1e();
        var tomorrow = this.c1f();
        var yesterday = this.d1f();
        var due = parseRelativeDate(this, value, today, tomorrow, yesterday);
        if (!(due == null)) {
          task = task.p1f(VOID, VOID, VOID, VOID, VOID, VOID, VOID, due);
          var tmp_7;
          // Inline function 'kotlin.text.isNotBlank' call
          if (!isBlank(timeRaw)) {
            tmp_7 = this.s1e_1.cb(timeRaw);
          } else {
            tmp_7 = false;
          }
          if (tmp_7) {
            task = task.p1f(VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, this.e1f(timeRaw));
          } else {
            var tmp_8;
            if (value === 'now') {
              // Inline function 'kotlin.text.isNotBlank' call
              tmp_8 = !isBlank(timeRaw);
            } else {
              tmp_8 = false;
            }
            if (tmp_8) {
              task = task.p1f(VOID, VOID, VOID, VOID, VOID, VOID, VOID, VOID, this.e1f(timeRaw));
            }
          }
        } else if (this.s1e_1.cb(value)) {
          task = task.p1f(VOID, VOID, VOID, VOID, VOID, VOID, VOID, today, this.e1f(value));
        }
      }
      if (task.n1f_1 == null) {
        var tmp4_safe_receiver = this.a1f_1.db(cleanText);
        var tmp5_safe_receiver = tmp4_safe_receiver == null ? null : tmp4_safe_receiver.zb();
        var tmp6_safe_receiver = tmp5_safe_receiver == null ? null : tmp5_safe_receiver.k(1);
        var tmp_9;
        if (tmp6_safe_receiver == null) {
          tmp_9 = null;
        } else {
          // Inline function 'kotlin.text.lowercase' call
          // Inline function 'kotlin.js.asDynamic' call
          tmp_9 = tmp6_safe_receiver.toLowerCase();
        }
        var tmp7_safe_receiver = tmp_9;
        var tmp8_safe_receiver = tmp7_safe_receiver == null ? null : trimEnd(tmp7_safe_receiver, charArrayOf([_Char___init__impl__6a9atx(44), _Char___init__impl__6a9atx(59)]));
        var tmp_10;
        if (tmp8_safe_receiver == null) {
          tmp_10 = null;
        } else {
          // Inline function 'kotlin.takeIf' call
          var tmp_11;
          if (TodoParser_getInstance().s1e_1.cb(tmp8_safe_receiver)) {
            tmp_11 = tmp8_safe_receiver;
          } else {
            tmp_11 = null;
          }
          tmp_10 = tmp_11;
        }
        var tmp9_safe_receiver = tmp_10;
        if (tmp9_safe_receiver == null)
          null;
        else {
          // Inline function 'kotlin.let' call
          task = task.p1f(VOID, VOID, VOID, VOID, VOID, VOID, VOID, TodoParser_getInstance().g1e(), TodoParser_getInstance().e1f(tmp9_safe_receiver));
        }
      }
    }
    if (task.n1f_1 == null) {
      var tmp10_safe_receiver = this.b1f_1.db(cleanText);
      var tmp11_safe_receiver = tmp10_safe_receiver == null ? null : tmp10_safe_receiver.zb();
      var tmp12_safe_receiver = tmp11_safe_receiver == null ? null : getOrNull(tmp11_safe_receiver, 1);
      var tmp_12;
      if (tmp12_safe_receiver == null) {
        tmp_12 = null;
      } else {
        // Inline function 'kotlin.takeIf' call
        var tmp_13;
        if (TodoParser_getInstance().s1e_1.cb(tmp12_safe_receiver)) {
          tmp_13 = tmp12_safe_receiver;
        } else {
          tmp_13 = null;
        }
        tmp_12 = tmp_13;
      }
      var tmp13_safe_receiver = tmp_12;
      if (tmp13_safe_receiver == null)
        null;
      else {
        // Inline function 'kotlin.let' call
        task = task.p1f(VOID, VOID, VOID, VOID, VOID, VOID, VOID, TodoParser_getInstance().g1e(), TodoParser_getInstance().e1f(tmp13_safe_receiver));
      }
    }
    return task;
  };
  protoOf(TodoParser).q1f = function (content) {
    // Inline function 'kotlin.collections.mapIndexed' call
    var this_0 = split(content, ['\n']);
    // Inline function 'kotlin.collections.mapIndexedTo' call
    var destination = ArrayList_init_$Create$(collectionSizeOrDefault(this_0, 10));
    var index = 0;
    var _iterator__ex2g4s = this_0.g();
    while (_iterator__ex2g4s.h()) {
      var item = _iterator__ex2g4s.i();
      var _unary__edvuaz = index;
      index = _unary__edvuaz + 1 | 0;
      var index_0 = checkIndexOverflow(_unary__edvuaz);
      var tmp$ret$0 = TodoParser_getInstance().f1f(item, index_0);
      destination.e(tmp$ret$0);
    }
    // Inline function 'kotlin.collections.filter' call
    // Inline function 'kotlin.collections.filterTo' call
    var destination_0 = ArrayList_init_$Create$_0();
    var _iterator__ex2g4s_0 = destination.g();
    while (_iterator__ex2g4s_0.h()) {
      var element = _iterator__ex2g4s_0.i();
      // Inline function 'kotlin.text.isNotBlank' call
      var this_1 = element.h1f_1;
      if (!isBlank(this_1)) {
        destination_0.e(element);
      }
    }
    var tasks = destination_0;
    // Inline function 'kotlin.collections.filter' call
    // Inline function 'kotlin.collections.filterTo' call
    var destination_1 = ArrayList_init_$Create$_0();
    var _iterator__ex2g4s_1 = tasks.g();
    while (_iterator__ex2g4s_1.h()) {
      var element_0 = _iterator__ex2g4s_1.i();
      if (!element_0.j1f_1) {
        destination_1.e(element_0);
      }
    }
    var active = destination_1;
    // Inline function 'kotlin.collections.groupBy' call
    // Inline function 'kotlin.collections.groupByTo' call
    var destination_2 = LinkedHashMap_init_$Create$();
    var _iterator__ex2g4s_2 = active.g();
    while (_iterator__ex2g4s_2.h()) {
      var element_1 = _iterator__ex2g4s_2.i();
      var tmp0_elvis_lhs = element_1.k1f_1;
      var key = tmp0_elvis_lhs == null ? '' : tmp0_elvis_lhs;
      // Inline function 'kotlin.collections.getOrPut' call
      var value = destination_2.v1(key);
      var tmp;
      if (value == null) {
        var answer = ArrayList_init_$Create$_0();
        destination_2.c2(key, answer);
        tmp = answer;
      } else {
        tmp = value;
      }
      var list = tmp;
      list.e(element_1);
    }
    var tmp_0 = destination_2;
    // Inline function 'kotlin.collections.flatMap' call
    // Inline function 'kotlin.collections.flatMapTo' call
    var destination_3 = ArrayList_init_$Create$_0();
    var _iterator__ex2g4s_3 = active.g();
    while (_iterator__ex2g4s_3.h()) {
      var element_2 = _iterator__ex2g4s_3.i();
      var list_0 = element_2.l1f_1;
      addAll(destination_3, list_0);
    }
    // Inline function 'kotlin.collections.associateWith' call
    var this_2 = distinct(destination_3);
    var result = LinkedHashMap_init_$Create$_0(coerceAtLeast(mapCapacity(collectionSizeOrDefault(this_2, 10)), 16));
    // Inline function 'kotlin.collections.associateWithTo' call
    var _iterator__ex2g4s_4 = this_2.g();
    while (_iterator__ex2g4s_4.h()) {
      var element_3 = _iterator__ex2g4s_4.i();
      // Inline function 'kotlin.collections.filter' call
      // Inline function 'kotlin.collections.filterTo' call
      var destination_4 = ArrayList_init_$Create$_0();
      var _iterator__ex2g4s_5 = active.g();
      while (_iterator__ex2g4s_5.h()) {
        var element_4 = _iterator__ex2g4s_5.i();
        if (element_4.l1f_1.p1(element_3)) {
          destination_4.e(element_4);
        }
      }
      result.c2(element_3, destination_4);
    }
    var tmp_1 = result;
    // Inline function 'kotlin.collections.flatMap' call
    // Inline function 'kotlin.collections.flatMapTo' call
    var destination_5 = ArrayList_init_$Create$_0();
    var _iterator__ex2g4s_6 = active.g();
    while (_iterator__ex2g4s_6.h()) {
      var element_5 = _iterator__ex2g4s_6.i();
      var list_1 = element_5.m1f_1;
      addAll(destination_5, list_1);
    }
    // Inline function 'kotlin.collections.associateWith' call
    var this_3 = distinct(destination_5);
    var result_0 = LinkedHashMap_init_$Create$_0(coerceAtLeast(mapCapacity(collectionSizeOrDefault(this_3, 10)), 16));
    // Inline function 'kotlin.collections.associateWithTo' call
    var _iterator__ex2g4s_7 = this_3.g();
    while (_iterator__ex2g4s_7.h()) {
      var element_6 = _iterator__ex2g4s_7.i();
      // Inline function 'kotlin.collections.filter' call
      // Inline function 'kotlin.collections.filterTo' call
      var destination_6 = ArrayList_init_$Create$_0();
      var _iterator__ex2g4s_8 = active.g();
      while (_iterator__ex2g4s_8.h()) {
        var element_7 = _iterator__ex2g4s_8.i();
        if (element_7.m1f_1.p1(element_6)) {
          destination_6.e(element_7);
        }
      }
      result_0.c2(element_6, destination_6);
    }
    var tmp_2 = result_0;
    // Inline function 'kotlin.collections.filter' call
    // Inline function 'kotlin.collections.filterTo' call
    var destination_7 = ArrayList_init_$Create$_0();
    var _iterator__ex2g4s_9 = active.g();
    while (_iterator__ex2g4s_9.h()) {
      var element_8 = _iterator__ex2g4s_9.i();
      if (!(element_8.n1f_1 == null)) {
        destination_7.e(element_8);
      }
    }
    // Inline function 'kotlin.collections.groupBy' call
    // Inline function 'kotlin.collections.groupByTo' call
    var destination_8 = LinkedHashMap_init_$Create$();
    var _iterator__ex2g4s_10 = destination_7.g();
    while (_iterator__ex2g4s_10.h()) {
      var element_9 = _iterator__ex2g4s_10.i();
      var key_0 = ensureNotNull(element_9.n1f_1);
      // Inline function 'kotlin.collections.getOrPut' call
      var value_0 = destination_8.v1(key_0);
      var tmp_3;
      if (value_0 == null) {
        var answer_0 = ArrayList_init_$Create$_0();
        destination_8.c2(key_0, answer_0);
        tmp_3 = answer_0;
      } else {
        tmp_3 = value_0;
      }
      var list_2 = tmp_3;
      list_2.e(element_9);
    }
    var tmp_4 = destination_8;
    var tmp$ret$42;
    $l$block: {
      // Inline function 'kotlin.collections.count' call
      var tmp_5;
      if (isInterface(tasks, Collection)) {
        tmp_5 = tasks.p();
      } else {
        tmp_5 = false;
      }
      if (tmp_5) {
        tmp$ret$42 = 0;
        break $l$block;
      }
      var count = 0;
      var _iterator__ex2g4s_11 = tasks.g();
      while (_iterator__ex2g4s_11.h()) {
        var element_10 = _iterator__ex2g4s_11.i();
        if (element_10.j1f_1) {
          count = count + 1 | 0;
          checkCountOverflow(count);
        }
      }
      tmp$ret$42 = count;
    }
    return new ParsedTodoContent(tasks, tmp_0, tmp_1, tmp_2, tmp_4, tmp$ret$42);
  };
  var TodoParser_instance;
  function TodoParser_getInstance() {
    if (TodoParser_instance == null)
      new TodoParser();
    return TodoParser_instance;
  }
  function Task$Companion$$childSerializers$_anonymous__ti6obp() {
    return new ArrayListSerializer(StringSerializer_getInstance());
  }
  function Task$Companion$$childSerializers$_anonymous__ti6obp_0() {
    return new ArrayListSerializer(StringSerializer_getInstance());
  }
  function Companion() {
    Companion_instance = this;
    var tmp = this;
    var tmp_0 = LazyThreadSafetyMode_PUBLICATION_getInstance();
    var tmp_1 = lazy(tmp_0, Task$Companion$$childSerializers$_anonymous__ti6obp);
    var tmp_2 = LazyThreadSafetyMode_PUBLICATION_getInstance();
    // Inline function 'kotlin.arrayOf' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    tmp.r1f_1 = [null, null, null, null, null, tmp_1, lazy(tmp_2, Task$Companion$$childSerializers$_anonymous__ti6obp_0), null, null];
  }
  var Companion_instance;
  function Companion_getInstance() {
    if (Companion_instance == null)
      new Companion();
    return Companion_instance;
  }
  function $serializer() {
    $serializer_instance = this;
    var tmp0_serialDesc = new PluginGeneratedSerialDescriptor('app.todotxt.core.Task', this, 9);
    tmp0_serialDesc.dt('id', false);
    tmp0_serialDesc.dt('text', false);
    tmp0_serialDesc.dt('raw', false);
    tmp0_serialDesc.dt('completed', false);
    tmp0_serialDesc.dt('priority', true);
    tmp0_serialDesc.dt('projects', true);
    tmp0_serialDesc.dt('contexts', true);
    tmp0_serialDesc.dt('due', true);
    tmp0_serialDesc.dt('dueTime', true);
    this.s1f_1 = tmp0_serialDesc;
  }
  protoOf($serializer).t1f = function (encoder, value) {
    var tmp0_desc = this.s1f_1;
    var tmp1_output = encoder.pl(tmp0_desc);
    var tmp2_cached = Companion_getInstance().r1f_1;
    tmp1_output.zm(tmp0_desc, 0, value.g1f_1);
    tmp1_output.en(tmp0_desc, 1, value.h1f_1);
    tmp1_output.en(tmp0_desc, 2, value.i1f_1);
    tmp1_output.wm(tmp0_desc, 3, value.j1f_1);
    if (tmp1_output.mn(tmp0_desc, 4) ? true : !(value.k1f_1 == null)) {
      tmp1_output.in(tmp0_desc, 4, StringSerializer_getInstance(), value.k1f_1);
    }
    if (tmp1_output.mn(tmp0_desc, 5) ? true : !equals(value.l1f_1, emptyList())) {
      tmp1_output.gn(tmp0_desc, 5, tmp2_cached[5].s1(), value.l1f_1);
    }
    if (tmp1_output.mn(tmp0_desc, 6) ? true : !equals(value.m1f_1, emptyList())) {
      tmp1_output.gn(tmp0_desc, 6, tmp2_cached[6].s1(), value.m1f_1);
    }
    if (tmp1_output.mn(tmp0_desc, 7) ? true : !(value.n1f_1 == null)) {
      tmp1_output.in(tmp0_desc, 7, StringSerializer_getInstance(), value.n1f_1);
    }
    if (tmp1_output.mn(tmp0_desc, 8) ? true : !(value.o1f_1 == null)) {
      tmp1_output.in(tmp0_desc, 8, StringSerializer_getInstance(), value.o1f_1);
    }
    tmp1_output.ql(tmp0_desc);
  };
  protoOf($serializer).pi = function (encoder, value) {
    return this.t1f(encoder, value instanceof Task ? value : THROW_CCE());
  };
  protoOf($serializer).qi = function (decoder) {
    var tmp0_desc = this.s1f_1;
    var tmp1_flag = true;
    var tmp2_index = 0;
    var tmp3_bitMask0 = 0;
    var tmp4_local0 = 0;
    var tmp5_local1 = null;
    var tmp6_local2 = null;
    var tmp7_local3 = false;
    var tmp8_local4 = null;
    var tmp9_local5 = null;
    var tmp10_local6 = null;
    var tmp11_local7 = null;
    var tmp12_local8 = null;
    var tmp13_input = decoder.pl(tmp0_desc);
    var tmp14_cached = Companion_getInstance().r1f_1;
    if (tmp13_input.fm()) {
      tmp4_local0 = tmp13_input.ul(tmp0_desc, 0);
      tmp3_bitMask0 = tmp3_bitMask0 | 1;
      tmp5_local1 = tmp13_input.zl(tmp0_desc, 1);
      tmp3_bitMask0 = tmp3_bitMask0 | 2;
      tmp6_local2 = tmp13_input.zl(tmp0_desc, 2);
      tmp3_bitMask0 = tmp3_bitMask0 | 4;
      tmp7_local3 = tmp13_input.rl(tmp0_desc, 3);
      tmp3_bitMask0 = tmp3_bitMask0 | 8;
      tmp8_local4 = tmp13_input.dm(tmp0_desc, 4, StringSerializer_getInstance(), tmp8_local4);
      tmp3_bitMask0 = tmp3_bitMask0 | 16;
      tmp9_local5 = tmp13_input.bm(tmp0_desc, 5, tmp14_cached[5].s1(), tmp9_local5);
      tmp3_bitMask0 = tmp3_bitMask0 | 32;
      tmp10_local6 = tmp13_input.bm(tmp0_desc, 6, tmp14_cached[6].s1(), tmp10_local6);
      tmp3_bitMask0 = tmp3_bitMask0 | 64;
      tmp11_local7 = tmp13_input.dm(tmp0_desc, 7, StringSerializer_getInstance(), tmp11_local7);
      tmp3_bitMask0 = tmp3_bitMask0 | 128;
      tmp12_local8 = tmp13_input.dm(tmp0_desc, 8, StringSerializer_getInstance(), tmp12_local8);
      tmp3_bitMask0 = tmp3_bitMask0 | 256;
    } else
      while (tmp1_flag) {
        tmp2_index = tmp13_input.gm(tmp0_desc);
        switch (tmp2_index) {
          case -1:
            tmp1_flag = false;
            break;
          case 0:
            tmp4_local0 = tmp13_input.ul(tmp0_desc, 0);
            tmp3_bitMask0 = tmp3_bitMask0 | 1;
            break;
          case 1:
            tmp5_local1 = tmp13_input.zl(tmp0_desc, 1);
            tmp3_bitMask0 = tmp3_bitMask0 | 2;
            break;
          case 2:
            tmp6_local2 = tmp13_input.zl(tmp0_desc, 2);
            tmp3_bitMask0 = tmp3_bitMask0 | 4;
            break;
          case 3:
            tmp7_local3 = tmp13_input.rl(tmp0_desc, 3);
            tmp3_bitMask0 = tmp3_bitMask0 | 8;
            break;
          case 4:
            tmp8_local4 = tmp13_input.dm(tmp0_desc, 4, StringSerializer_getInstance(), tmp8_local4);
            tmp3_bitMask0 = tmp3_bitMask0 | 16;
            break;
          case 5:
            tmp9_local5 = tmp13_input.bm(tmp0_desc, 5, tmp14_cached[5].s1(), tmp9_local5);
            tmp3_bitMask0 = tmp3_bitMask0 | 32;
            break;
          case 6:
            tmp10_local6 = tmp13_input.bm(tmp0_desc, 6, tmp14_cached[6].s1(), tmp10_local6);
            tmp3_bitMask0 = tmp3_bitMask0 | 64;
            break;
          case 7:
            tmp11_local7 = tmp13_input.dm(tmp0_desc, 7, StringSerializer_getInstance(), tmp11_local7);
            tmp3_bitMask0 = tmp3_bitMask0 | 128;
            break;
          case 8:
            tmp12_local8 = tmp13_input.dm(tmp0_desc, 8, StringSerializer_getInstance(), tmp12_local8);
            tmp3_bitMask0 = tmp3_bitMask0 | 256;
            break;
          default:
            throw UnknownFieldException_init_$Create$(tmp2_index);
        }
      }
    tmp13_input.ql(tmp0_desc);
    return Task_init_$Create$(tmp3_bitMask0, tmp4_local0, tmp5_local1, tmp6_local2, tmp7_local3, tmp8_local4, tmp9_local5, tmp10_local6, tmp11_local7, tmp12_local8, null);
  };
  protoOf($serializer).oi = function () {
    return this.s1f_1;
  };
  protoOf($serializer).st = function () {
    var tmp0_cached = Companion_getInstance().r1f_1;
    // Inline function 'kotlin.arrayOf' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    return [IntSerializer_getInstance(), StringSerializer_getInstance(), StringSerializer_getInstance(), BooleanSerializer_getInstance(), get_nullable(StringSerializer_getInstance()), tmp0_cached[5].s1(), tmp0_cached[6].s1(), get_nullable(StringSerializer_getInstance()), get_nullable(StringSerializer_getInstance())];
  };
  var $serializer_instance;
  function $serializer_getInstance() {
    if ($serializer_instance == null)
      new $serializer();
    return $serializer_instance;
  }
  function Task_init_$Init$(seen0, id, text, raw, completed, priority, projects, contexts, due, dueTime, serializationConstructorMarker, $this) {
    if (!(15 === (15 & seen0))) {
      throwMissingFieldException(seen0, 15, $serializer_getInstance().s1f_1);
    }
    $this.g1f_1 = id;
    $this.h1f_1 = text;
    $this.i1f_1 = raw;
    $this.j1f_1 = completed;
    if (0 === (seen0 & 16))
      $this.k1f_1 = null;
    else
      $this.k1f_1 = priority;
    if (0 === (seen0 & 32))
      $this.l1f_1 = emptyList();
    else
      $this.l1f_1 = projects;
    if (0 === (seen0 & 64))
      $this.m1f_1 = emptyList();
    else
      $this.m1f_1 = contexts;
    if (0 === (seen0 & 128))
      $this.n1f_1 = null;
    else
      $this.n1f_1 = due;
    if (0 === (seen0 & 256))
      $this.o1f_1 = null;
    else
      $this.o1f_1 = dueTime;
    return $this;
  }
  function Task_init_$Create$(seen0, id, text, raw, completed, priority, projects, contexts, due, dueTime, serializationConstructorMarker) {
    return Task_init_$Init$(seen0, id, text, raw, completed, priority, projects, contexts, due, dueTime, serializationConstructorMarker, objectCreate(protoOf(Task)));
  }
  function Task(id, text, raw, completed, priority, projects, contexts, due, dueTime) {
    Companion_getInstance();
    priority = priority === VOID ? null : priority;
    projects = projects === VOID ? emptyList() : projects;
    contexts = contexts === VOID ? emptyList() : contexts;
    due = due === VOID ? null : due;
    dueTime = dueTime === VOID ? null : dueTime;
    this.g1f_1 = id;
    this.h1f_1 = text;
    this.i1f_1 = raw;
    this.j1f_1 = completed;
    this.k1f_1 = priority;
    this.l1f_1 = projects;
    this.m1f_1 = contexts;
    this.n1f_1 = due;
    this.o1f_1 = dueTime;
  }
  protoOf(Task).u1f = function (id, text, raw, completed, priority, projects, contexts, due, dueTime) {
    return new Task(id, text, raw, completed, priority, projects, contexts, due, dueTime);
  };
  protoOf(Task).p1f = function (id, text, raw, completed, priority, projects, contexts, due, dueTime, $super) {
    id = id === VOID ? this.g1f_1 : id;
    text = text === VOID ? this.h1f_1 : text;
    raw = raw === VOID ? this.i1f_1 : raw;
    completed = completed === VOID ? this.j1f_1 : completed;
    priority = priority === VOID ? this.k1f_1 : priority;
    projects = projects === VOID ? this.l1f_1 : projects;
    contexts = contexts === VOID ? this.m1f_1 : contexts;
    due = due === VOID ? this.n1f_1 : due;
    dueTime = dueTime === VOID ? this.o1f_1 : dueTime;
    return $super === VOID ? this.u1f(id, text, raw, completed, priority, projects, contexts, due, dueTime) : $super.u1f.call(this, id, text, raw, completed, priority, projects, contexts, due, dueTime);
  };
  protoOf(Task).toString = function () {
    return 'Task(id=' + this.g1f_1 + ', text=' + this.h1f_1 + ', raw=' + this.i1f_1 + ', completed=' + this.j1f_1 + ', priority=' + this.k1f_1 + ', projects=' + toString(this.l1f_1) + ', contexts=' + toString(this.m1f_1) + ', due=' + this.n1f_1 + ', dueTime=' + this.o1f_1 + ')';
  };
  protoOf(Task).hashCode = function () {
    var result = this.g1f_1;
    result = imul(result, 31) + getStringHashCode(this.h1f_1) | 0;
    result = imul(result, 31) + getStringHashCode(this.i1f_1) | 0;
    result = imul(result, 31) + getBooleanHashCode(this.j1f_1) | 0;
    result = imul(result, 31) + (this.k1f_1 == null ? 0 : getStringHashCode(this.k1f_1)) | 0;
    result = imul(result, 31) + hashCode(this.l1f_1) | 0;
    result = imul(result, 31) + hashCode(this.m1f_1) | 0;
    result = imul(result, 31) + (this.n1f_1 == null ? 0 : getStringHashCode(this.n1f_1)) | 0;
    result = imul(result, 31) + (this.o1f_1 == null ? 0 : getStringHashCode(this.o1f_1)) | 0;
    return result;
  };
  protoOf(Task).equals = function (other) {
    if (this === other)
      return true;
    if (!(other instanceof Task))
      return false;
    var tmp0_other_with_cast = other instanceof Task ? other : THROW_CCE();
    if (!(this.g1f_1 === tmp0_other_with_cast.g1f_1))
      return false;
    if (!(this.h1f_1 === tmp0_other_with_cast.h1f_1))
      return false;
    if (!(this.i1f_1 === tmp0_other_with_cast.i1f_1))
      return false;
    if (!(this.j1f_1 === tmp0_other_with_cast.j1f_1))
      return false;
    if (!(this.k1f_1 == tmp0_other_with_cast.k1f_1))
      return false;
    if (!equals(this.l1f_1, tmp0_other_with_cast.l1f_1))
      return false;
    if (!equals(this.m1f_1, tmp0_other_with_cast.m1f_1))
      return false;
    if (!(this.n1f_1 == tmp0_other_with_cast.n1f_1))
      return false;
    if (!(this.o1f_1 == tmp0_other_with_cast.o1f_1))
      return false;
    return true;
  };
  function ParsedTodoContent$Companion$$childSerializers$_anonymous__jo4wdk() {
    return new ArrayListSerializer($serializer_getInstance());
  }
  function ParsedTodoContent$Companion$$childSerializers$_anonymous__jo4wdk_0() {
    return new LinkedHashMapSerializer(StringSerializer_getInstance(), new ArrayListSerializer($serializer_getInstance()));
  }
  function ParsedTodoContent$Companion$$childSerializers$_anonymous__jo4wdk_1() {
    return new LinkedHashMapSerializer(StringSerializer_getInstance(), new ArrayListSerializer($serializer_getInstance()));
  }
  function ParsedTodoContent$Companion$$childSerializers$_anonymous__jo4wdk_2() {
    return new LinkedHashMapSerializer(StringSerializer_getInstance(), new ArrayListSerializer($serializer_getInstance()));
  }
  function ParsedTodoContent$Companion$$childSerializers$_anonymous__jo4wdk_3() {
    return new LinkedHashMapSerializer(StringSerializer_getInstance(), new ArrayListSerializer($serializer_getInstance()));
  }
  function Companion_0() {
    Companion_instance_0 = this;
    var tmp = this;
    var tmp_0 = LazyThreadSafetyMode_PUBLICATION_getInstance();
    var tmp_1 = lazy(tmp_0, ParsedTodoContent$Companion$$childSerializers$_anonymous__jo4wdk);
    var tmp_2 = LazyThreadSafetyMode_PUBLICATION_getInstance();
    var tmp_3 = lazy(tmp_2, ParsedTodoContent$Companion$$childSerializers$_anonymous__jo4wdk_0);
    var tmp_4 = LazyThreadSafetyMode_PUBLICATION_getInstance();
    var tmp_5 = lazy(tmp_4, ParsedTodoContent$Companion$$childSerializers$_anonymous__jo4wdk_1);
    var tmp_6 = LazyThreadSafetyMode_PUBLICATION_getInstance();
    var tmp_7 = lazy(tmp_6, ParsedTodoContent$Companion$$childSerializers$_anonymous__jo4wdk_2);
    var tmp_8 = LazyThreadSafetyMode_PUBLICATION_getInstance();
    // Inline function 'kotlin.arrayOf' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    tmp.v1f_1 = [tmp_1, tmp_3, tmp_5, tmp_7, lazy(tmp_8, ParsedTodoContent$Companion$$childSerializers$_anonymous__jo4wdk_3), null];
  }
  var Companion_instance_0;
  function Companion_getInstance_0() {
    if (Companion_instance_0 == null)
      new Companion_0();
    return Companion_instance_0;
  }
  function $serializer_0() {
    $serializer_instance_0 = this;
    var tmp0_serialDesc = new PluginGeneratedSerialDescriptor('app.todotxt.core.ParsedTodoContent', this, 6);
    tmp0_serialDesc.dt('tasks', false);
    tmp0_serialDesc.dt('priorities', true);
    tmp0_serialDesc.dt('projects', true);
    tmp0_serialDesc.dt('contexts', true);
    tmp0_serialDesc.dt('dueDates', true);
    tmp0_serialDesc.dt('completedCount', true);
    this.w1f_1 = tmp0_serialDesc;
  }
  protoOf($serializer_0).x1f = function (encoder, value) {
    var tmp0_desc = this.w1f_1;
    var tmp1_output = encoder.pl(tmp0_desc);
    var tmp2_cached = Companion_getInstance_0().v1f_1;
    tmp1_output.gn(tmp0_desc, 0, tmp2_cached[0].s1(), value.y1f_1);
    if (tmp1_output.mn(tmp0_desc, 1) ? true : !equals(value.z1f_1, emptyMap())) {
      tmp1_output.gn(tmp0_desc, 1, tmp2_cached[1].s1(), value.z1f_1);
    }
    if (tmp1_output.mn(tmp0_desc, 2) ? true : !equals(value.a1g_1, emptyMap())) {
      tmp1_output.gn(tmp0_desc, 2, tmp2_cached[2].s1(), value.a1g_1);
    }
    if (tmp1_output.mn(tmp0_desc, 3) ? true : !equals(value.b1g_1, emptyMap())) {
      tmp1_output.gn(tmp0_desc, 3, tmp2_cached[3].s1(), value.b1g_1);
    }
    if (tmp1_output.mn(tmp0_desc, 4) ? true : !equals(value.c1g_1, emptyMap())) {
      tmp1_output.gn(tmp0_desc, 4, tmp2_cached[4].s1(), value.c1g_1);
    }
    if (tmp1_output.mn(tmp0_desc, 5) ? true : !(value.d1g_1 === 0)) {
      tmp1_output.zm(tmp0_desc, 5, value.d1g_1);
    }
    tmp1_output.ql(tmp0_desc);
  };
  protoOf($serializer_0).pi = function (encoder, value) {
    return this.x1f(encoder, value instanceof ParsedTodoContent ? value : THROW_CCE());
  };
  protoOf($serializer_0).qi = function (decoder) {
    var tmp0_desc = this.w1f_1;
    var tmp1_flag = true;
    var tmp2_index = 0;
    var tmp3_bitMask0 = 0;
    var tmp4_local0 = null;
    var tmp5_local1 = null;
    var tmp6_local2 = null;
    var tmp7_local3 = null;
    var tmp8_local4 = null;
    var tmp9_local5 = 0;
    var tmp10_input = decoder.pl(tmp0_desc);
    var tmp11_cached = Companion_getInstance_0().v1f_1;
    if (tmp10_input.fm()) {
      tmp4_local0 = tmp10_input.bm(tmp0_desc, 0, tmp11_cached[0].s1(), tmp4_local0);
      tmp3_bitMask0 = tmp3_bitMask0 | 1;
      tmp5_local1 = tmp10_input.bm(tmp0_desc, 1, tmp11_cached[1].s1(), tmp5_local1);
      tmp3_bitMask0 = tmp3_bitMask0 | 2;
      tmp6_local2 = tmp10_input.bm(tmp0_desc, 2, tmp11_cached[2].s1(), tmp6_local2);
      tmp3_bitMask0 = tmp3_bitMask0 | 4;
      tmp7_local3 = tmp10_input.bm(tmp0_desc, 3, tmp11_cached[3].s1(), tmp7_local3);
      tmp3_bitMask0 = tmp3_bitMask0 | 8;
      tmp8_local4 = tmp10_input.bm(tmp0_desc, 4, tmp11_cached[4].s1(), tmp8_local4);
      tmp3_bitMask0 = tmp3_bitMask0 | 16;
      tmp9_local5 = tmp10_input.ul(tmp0_desc, 5);
      tmp3_bitMask0 = tmp3_bitMask0 | 32;
    } else
      while (tmp1_flag) {
        tmp2_index = tmp10_input.gm(tmp0_desc);
        switch (tmp2_index) {
          case -1:
            tmp1_flag = false;
            break;
          case 0:
            tmp4_local0 = tmp10_input.bm(tmp0_desc, 0, tmp11_cached[0].s1(), tmp4_local0);
            tmp3_bitMask0 = tmp3_bitMask0 | 1;
            break;
          case 1:
            tmp5_local1 = tmp10_input.bm(tmp0_desc, 1, tmp11_cached[1].s1(), tmp5_local1);
            tmp3_bitMask0 = tmp3_bitMask0 | 2;
            break;
          case 2:
            tmp6_local2 = tmp10_input.bm(tmp0_desc, 2, tmp11_cached[2].s1(), tmp6_local2);
            tmp3_bitMask0 = tmp3_bitMask0 | 4;
            break;
          case 3:
            tmp7_local3 = tmp10_input.bm(tmp0_desc, 3, tmp11_cached[3].s1(), tmp7_local3);
            tmp3_bitMask0 = tmp3_bitMask0 | 8;
            break;
          case 4:
            tmp8_local4 = tmp10_input.bm(tmp0_desc, 4, tmp11_cached[4].s1(), tmp8_local4);
            tmp3_bitMask0 = tmp3_bitMask0 | 16;
            break;
          case 5:
            tmp9_local5 = tmp10_input.ul(tmp0_desc, 5);
            tmp3_bitMask0 = tmp3_bitMask0 | 32;
            break;
          default:
            throw UnknownFieldException_init_$Create$(tmp2_index);
        }
      }
    tmp10_input.ql(tmp0_desc);
    return ParsedTodoContent_init_$Create$(tmp3_bitMask0, tmp4_local0, tmp5_local1, tmp6_local2, tmp7_local3, tmp8_local4, tmp9_local5, null);
  };
  protoOf($serializer_0).oi = function () {
    return this.w1f_1;
  };
  protoOf($serializer_0).st = function () {
    var tmp0_cached = Companion_getInstance_0().v1f_1;
    // Inline function 'kotlin.arrayOf' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    return [tmp0_cached[0].s1(), tmp0_cached[1].s1(), tmp0_cached[2].s1(), tmp0_cached[3].s1(), tmp0_cached[4].s1(), IntSerializer_getInstance()];
  };
  var $serializer_instance_0;
  function $serializer_getInstance_0() {
    if ($serializer_instance_0 == null)
      new $serializer_0();
    return $serializer_instance_0;
  }
  function ParsedTodoContent_init_$Init$(seen0, tasks, priorities, projects, contexts, dueDates, completedCount, serializationConstructorMarker, $this) {
    if (!(1 === (1 & seen0))) {
      throwMissingFieldException(seen0, 1, $serializer_getInstance_0().w1f_1);
    }
    $this.y1f_1 = tasks;
    if (0 === (seen0 & 2))
      $this.z1f_1 = emptyMap();
    else
      $this.z1f_1 = priorities;
    if (0 === (seen0 & 4))
      $this.a1g_1 = emptyMap();
    else
      $this.a1g_1 = projects;
    if (0 === (seen0 & 8))
      $this.b1g_1 = emptyMap();
    else
      $this.b1g_1 = contexts;
    if (0 === (seen0 & 16))
      $this.c1g_1 = emptyMap();
    else
      $this.c1g_1 = dueDates;
    if (0 === (seen0 & 32))
      $this.d1g_1 = 0;
    else
      $this.d1g_1 = completedCount;
    return $this;
  }
  function ParsedTodoContent_init_$Create$(seen0, tasks, priorities, projects, contexts, dueDates, completedCount, serializationConstructorMarker) {
    return ParsedTodoContent_init_$Init$(seen0, tasks, priorities, projects, contexts, dueDates, completedCount, serializationConstructorMarker, objectCreate(protoOf(ParsedTodoContent)));
  }
  function ParsedTodoContent(tasks, priorities, projects, contexts, dueDates, completedCount) {
    Companion_getInstance_0();
    priorities = priorities === VOID ? emptyMap() : priorities;
    projects = projects === VOID ? emptyMap() : projects;
    contexts = contexts === VOID ? emptyMap() : contexts;
    dueDates = dueDates === VOID ? emptyMap() : dueDates;
    completedCount = completedCount === VOID ? 0 : completedCount;
    this.y1f_1 = tasks;
    this.z1f_1 = priorities;
    this.a1g_1 = projects;
    this.b1g_1 = contexts;
    this.c1g_1 = dueDates;
    this.d1g_1 = completedCount;
  }
  protoOf(ParsedTodoContent).toString = function () {
    return 'ParsedTodoContent(tasks=' + toString(this.y1f_1) + ', priorities=' + toString(this.z1f_1) + ', projects=' + toString(this.a1g_1) + ', contexts=' + toString(this.b1g_1) + ', dueDates=' + toString(this.c1g_1) + ', completedCount=' + this.d1g_1 + ')';
  };
  protoOf(ParsedTodoContent).hashCode = function () {
    var result = hashCode(this.y1f_1);
    result = imul(result, 31) + hashCode(this.z1f_1) | 0;
    result = imul(result, 31) + hashCode(this.a1g_1) | 0;
    result = imul(result, 31) + hashCode(this.b1g_1) | 0;
    result = imul(result, 31) + hashCode(this.c1g_1) | 0;
    result = imul(result, 31) + this.d1g_1 | 0;
    return result;
  };
  protoOf(ParsedTodoContent).equals = function (other) {
    if (this === other)
      return true;
    if (!(other instanceof ParsedTodoContent))
      return false;
    var tmp0_other_with_cast = other instanceof ParsedTodoContent ? other : THROW_CCE();
    if (!equals(this.y1f_1, tmp0_other_with_cast.y1f_1))
      return false;
    if (!equals(this.z1f_1, tmp0_other_with_cast.z1f_1))
      return false;
    if (!equals(this.a1g_1, tmp0_other_with_cast.a1g_1))
      return false;
    if (!equals(this.b1g_1, tmp0_other_with_cast.b1g_1))
      return false;
    if (!equals(this.c1g_1, tmp0_other_with_cast.c1g_1))
      return false;
    if (!(this.d1g_1 === tmp0_other_with_cast.d1g_1))
      return false;
    return true;
  };
  function Habit$Companion$$childSerializers$_anonymous__xwhi46() {
    return Companion_getInstance_2().y14();
  }
  function Habit$Companion$$childSerializers$_anonymous__xwhi46_0() {
    return new ArrayListSerializer(StringSerializer_getInstance());
  }
  function Companion_1() {
    Companion_instance_1 = this;
    var tmp = this;
    var tmp_0 = LazyThreadSafetyMode_PUBLICATION_getInstance();
    var tmp_1 = lazy(tmp_0, Habit$Companion$$childSerializers$_anonymous__xwhi46);
    var tmp_2 = LazyThreadSafetyMode_PUBLICATION_getInstance();
    // Inline function 'kotlin.arrayOf' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    tmp.g1g_1 = [null, null, tmp_1, null, null, lazy(tmp_2, Habit$Companion$$childSerializers$_anonymous__xwhi46_0), null, null, null];
  }
  var Companion_instance_1;
  function Companion_getInstance_1() {
    if (Companion_instance_1 == null)
      new Companion_1();
    return Companion_instance_1;
  }
  function $serializer_1() {
    $serializer_instance_1 = this;
    var tmp0_serialDesc = new PluginGeneratedSerialDescriptor('app.todotxt.core.Habit', this, 9);
    tmp0_serialDesc.dt('id', false);
    tmp0_serialDesc.dt('name', false);
    tmp0_serialDesc.dt('color', false);
    tmp0_serialDesc.dt('reminderEnabled', true);
    tmp0_serialDesc.dt('reminderTime', true);
    tmp0_serialDesc.dt('completedDates', true);
    tmp0_serialDesc.dt('archived', true);
    tmp0_serialDesc.dt('createdAt', true);
    tmp0_serialDesc.dt('updatedAt', true);
    this.h1g_1 = tmp0_serialDesc;
  }
  protoOf($serializer_1).i1g = function (encoder, value) {
    var tmp0_desc = this.h1g_1;
    var tmp1_output = encoder.pl(tmp0_desc);
    var tmp2_cached = Companion_getInstance_1().g1g_1;
    tmp1_output.en(tmp0_desc, 0, value.v1d_1);
    tmp1_output.en(tmp0_desc, 1, value.w1d_1);
    tmp1_output.gn(tmp0_desc, 2, tmp2_cached[2].s1(), value.x1d_1);
    if (tmp1_output.mn(tmp0_desc, 3) ? true : !(value.y1d_1 === false)) {
      tmp1_output.wm(tmp0_desc, 3, value.y1d_1);
    }
    if (tmp1_output.mn(tmp0_desc, 4) ? true : !(value.z1d_1 === '09:00')) {
      tmp1_output.en(tmp0_desc, 4, value.z1d_1);
    }
    if (tmp1_output.mn(tmp0_desc, 5) ? true : !equals(value.a1e_1, emptyList())) {
      tmp1_output.gn(tmp0_desc, 5, tmp2_cached[5].s1(), value.a1e_1);
    }
    if (tmp1_output.mn(tmp0_desc, 6) ? true : !(value.b1e_1 === false)) {
      tmp1_output.wm(tmp0_desc, 6, value.b1e_1);
    }
    if (tmp1_output.mn(tmp0_desc, 7) ? true : !value.c1e_1.equals(new Long(0, 0))) {
      tmp1_output.an(tmp0_desc, 7, value.c1e_1);
    }
    if (tmp1_output.mn(tmp0_desc, 8) ? true : !value.d1e_1.equals(new Long(0, 0))) {
      tmp1_output.an(tmp0_desc, 8, value.d1e_1);
    }
    tmp1_output.ql(tmp0_desc);
  };
  protoOf($serializer_1).pi = function (encoder, value) {
    return this.i1g(encoder, value instanceof Habit ? value : THROW_CCE());
  };
  protoOf($serializer_1).qi = function (decoder) {
    var tmp0_desc = this.h1g_1;
    var tmp1_flag = true;
    var tmp2_index = 0;
    var tmp3_bitMask0 = 0;
    var tmp4_local0 = null;
    var tmp5_local1 = null;
    var tmp6_local2 = null;
    var tmp7_local3 = false;
    var tmp8_local4 = null;
    var tmp9_local5 = null;
    var tmp10_local6 = false;
    var tmp11_local7 = new Long(0, 0);
    var tmp12_local8 = new Long(0, 0);
    var tmp13_input = decoder.pl(tmp0_desc);
    var tmp14_cached = Companion_getInstance_1().g1g_1;
    if (tmp13_input.fm()) {
      tmp4_local0 = tmp13_input.zl(tmp0_desc, 0);
      tmp3_bitMask0 = tmp3_bitMask0 | 1;
      tmp5_local1 = tmp13_input.zl(tmp0_desc, 1);
      tmp3_bitMask0 = tmp3_bitMask0 | 2;
      tmp6_local2 = tmp13_input.bm(tmp0_desc, 2, tmp14_cached[2].s1(), tmp6_local2);
      tmp3_bitMask0 = tmp3_bitMask0 | 4;
      tmp7_local3 = tmp13_input.rl(tmp0_desc, 3);
      tmp3_bitMask0 = tmp3_bitMask0 | 8;
      tmp8_local4 = tmp13_input.zl(tmp0_desc, 4);
      tmp3_bitMask0 = tmp3_bitMask0 | 16;
      tmp9_local5 = tmp13_input.bm(tmp0_desc, 5, tmp14_cached[5].s1(), tmp9_local5);
      tmp3_bitMask0 = tmp3_bitMask0 | 32;
      tmp10_local6 = tmp13_input.rl(tmp0_desc, 6);
      tmp3_bitMask0 = tmp3_bitMask0 | 64;
      tmp11_local7 = tmp13_input.vl(tmp0_desc, 7);
      tmp3_bitMask0 = tmp3_bitMask0 | 128;
      tmp12_local8 = tmp13_input.vl(tmp0_desc, 8);
      tmp3_bitMask0 = tmp3_bitMask0 | 256;
    } else
      while (tmp1_flag) {
        tmp2_index = tmp13_input.gm(tmp0_desc);
        switch (tmp2_index) {
          case -1:
            tmp1_flag = false;
            break;
          case 0:
            tmp4_local0 = tmp13_input.zl(tmp0_desc, 0);
            tmp3_bitMask0 = tmp3_bitMask0 | 1;
            break;
          case 1:
            tmp5_local1 = tmp13_input.zl(tmp0_desc, 1);
            tmp3_bitMask0 = tmp3_bitMask0 | 2;
            break;
          case 2:
            tmp6_local2 = tmp13_input.bm(tmp0_desc, 2, tmp14_cached[2].s1(), tmp6_local2);
            tmp3_bitMask0 = tmp3_bitMask0 | 4;
            break;
          case 3:
            tmp7_local3 = tmp13_input.rl(tmp0_desc, 3);
            tmp3_bitMask0 = tmp3_bitMask0 | 8;
            break;
          case 4:
            tmp8_local4 = tmp13_input.zl(tmp0_desc, 4);
            tmp3_bitMask0 = tmp3_bitMask0 | 16;
            break;
          case 5:
            tmp9_local5 = tmp13_input.bm(tmp0_desc, 5, tmp14_cached[5].s1(), tmp9_local5);
            tmp3_bitMask0 = tmp3_bitMask0 | 32;
            break;
          case 6:
            tmp10_local6 = tmp13_input.rl(tmp0_desc, 6);
            tmp3_bitMask0 = tmp3_bitMask0 | 64;
            break;
          case 7:
            tmp11_local7 = tmp13_input.vl(tmp0_desc, 7);
            tmp3_bitMask0 = tmp3_bitMask0 | 128;
            break;
          case 8:
            tmp12_local8 = tmp13_input.vl(tmp0_desc, 8);
            tmp3_bitMask0 = tmp3_bitMask0 | 256;
            break;
          default:
            throw UnknownFieldException_init_$Create$(tmp2_index);
        }
      }
    tmp13_input.ql(tmp0_desc);
    return Habit_init_$Create$(tmp3_bitMask0, tmp4_local0, tmp5_local1, tmp6_local2, tmp7_local3, tmp8_local4, tmp9_local5, tmp10_local6, tmp11_local7, tmp12_local8, null);
  };
  protoOf($serializer_1).oi = function () {
    return this.h1g_1;
  };
  protoOf($serializer_1).st = function () {
    var tmp0_cached = Companion_getInstance_1().g1g_1;
    // Inline function 'kotlin.arrayOf' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    return [StringSerializer_getInstance(), StringSerializer_getInstance(), tmp0_cached[2].s1(), BooleanSerializer_getInstance(), StringSerializer_getInstance(), tmp0_cached[5].s1(), BooleanSerializer_getInstance(), LongSerializer_getInstance(), LongSerializer_getInstance()];
  };
  var $serializer_instance_1;
  function $serializer_getInstance_1() {
    if ($serializer_instance_1 == null)
      new $serializer_1();
    return $serializer_instance_1;
  }
  function Habit_init_$Init$(seen0, id, name, color, reminderEnabled, reminderTime, completedDates, archived, createdAt, updatedAt, serializationConstructorMarker, $this) {
    if (!(7 === (7 & seen0))) {
      throwMissingFieldException(seen0, 7, $serializer_getInstance_1().h1g_1);
    }
    $this.v1d_1 = id;
    $this.w1d_1 = name;
    $this.x1d_1 = color;
    if (0 === (seen0 & 8))
      $this.y1d_1 = false;
    else
      $this.y1d_1 = reminderEnabled;
    if (0 === (seen0 & 16))
      $this.z1d_1 = '09:00';
    else
      $this.z1d_1 = reminderTime;
    if (0 === (seen0 & 32))
      $this.a1e_1 = emptyList();
    else
      $this.a1e_1 = completedDates;
    if (0 === (seen0 & 64))
      $this.b1e_1 = false;
    else
      $this.b1e_1 = archived;
    if (0 === (seen0 & 128))
      $this.c1e_1 = new Long(0, 0);
    else
      $this.c1e_1 = createdAt;
    if (0 === (seen0 & 256))
      $this.d1e_1 = new Long(0, 0);
    else
      $this.d1e_1 = updatedAt;
    return $this;
  }
  function Habit_init_$Create$(seen0, id, name, color, reminderEnabled, reminderTime, completedDates, archived, createdAt, updatedAt, serializationConstructorMarker) {
    return Habit_init_$Init$(seen0, id, name, color, reminderEnabled, reminderTime, completedDates, archived, createdAt, updatedAt, serializationConstructorMarker, objectCreate(protoOf(Habit)));
  }
  function Habit(id, name, color, reminderEnabled, reminderTime, completedDates, archived, createdAt, updatedAt) {
    Companion_getInstance_1();
    reminderEnabled = reminderEnabled === VOID ? false : reminderEnabled;
    reminderTime = reminderTime === VOID ? '09:00' : reminderTime;
    completedDates = completedDates === VOID ? emptyList() : completedDates;
    archived = archived === VOID ? false : archived;
    createdAt = createdAt === VOID ? new Long(0, 0) : createdAt;
    updatedAt = updatedAt === VOID ? new Long(0, 0) : updatedAt;
    this.v1d_1 = id;
    this.w1d_1 = name;
    this.x1d_1 = color;
    this.y1d_1 = reminderEnabled;
    this.z1d_1 = reminderTime;
    this.a1e_1 = completedDates;
    this.b1e_1 = archived;
    this.c1e_1 = createdAt;
    this.d1e_1 = updatedAt;
  }
  protoOf(Habit).j1g = function (id, name, color, reminderEnabled, reminderTime, completedDates, archived, createdAt, updatedAt) {
    return new Habit(id, name, color, reminderEnabled, reminderTime, completedDates, archived, createdAt, updatedAt);
  };
  protoOf(Habit).e1e = function (id, name, color, reminderEnabled, reminderTime, completedDates, archived, createdAt, updatedAt, $super) {
    id = id === VOID ? this.v1d_1 : id;
    name = name === VOID ? this.w1d_1 : name;
    color = color === VOID ? this.x1d_1 : color;
    reminderEnabled = reminderEnabled === VOID ? this.y1d_1 : reminderEnabled;
    reminderTime = reminderTime === VOID ? this.z1d_1 : reminderTime;
    completedDates = completedDates === VOID ? this.a1e_1 : completedDates;
    archived = archived === VOID ? this.b1e_1 : archived;
    createdAt = createdAt === VOID ? this.c1e_1 : createdAt;
    updatedAt = updatedAt === VOID ? this.d1e_1 : updatedAt;
    return $super === VOID ? this.j1g(id, name, color, reminderEnabled, reminderTime, completedDates, archived, createdAt, updatedAt) : $super.j1g.call(this, id, name, color, reminderEnabled, reminderTime, completedDates, archived, createdAt, updatedAt);
  };
  protoOf(Habit).toString = function () {
    return 'Habit(id=' + this.v1d_1 + ', name=' + this.w1d_1 + ', color=' + this.x1d_1.toString() + ', reminderEnabled=' + this.y1d_1 + ', reminderTime=' + this.z1d_1 + ', completedDates=' + toString(this.a1e_1) + ', archived=' + this.b1e_1 + ', createdAt=' + this.c1e_1.toString() + ', updatedAt=' + this.d1e_1.toString() + ')';
  };
  protoOf(Habit).hashCode = function () {
    var result = getStringHashCode(this.v1d_1);
    result = imul(result, 31) + getStringHashCode(this.w1d_1) | 0;
    result = imul(result, 31) + this.x1d_1.hashCode() | 0;
    result = imul(result, 31) + getBooleanHashCode(this.y1d_1) | 0;
    result = imul(result, 31) + getStringHashCode(this.z1d_1) | 0;
    result = imul(result, 31) + hashCode(this.a1e_1) | 0;
    result = imul(result, 31) + getBooleanHashCode(this.b1e_1) | 0;
    result = imul(result, 31) + this.c1e_1.hashCode() | 0;
    result = imul(result, 31) + this.d1e_1.hashCode() | 0;
    return result;
  };
  protoOf(Habit).equals = function (other) {
    if (this === other)
      return true;
    if (!(other instanceof Habit))
      return false;
    var tmp0_other_with_cast = other instanceof Habit ? other : THROW_CCE();
    if (!(this.v1d_1 === tmp0_other_with_cast.v1d_1))
      return false;
    if (!(this.w1d_1 === tmp0_other_with_cast.w1d_1))
      return false;
    if (!this.x1d_1.equals(tmp0_other_with_cast.x1d_1))
      return false;
    if (!(this.y1d_1 === tmp0_other_with_cast.y1d_1))
      return false;
    if (!(this.z1d_1 === tmp0_other_with_cast.z1d_1))
      return false;
    if (!equals(this.a1e_1, tmp0_other_with_cast.a1e_1))
      return false;
    if (!(this.b1e_1 === tmp0_other_with_cast.b1e_1))
      return false;
    if (!this.c1e_1.equals(tmp0_other_with_cast.c1e_1))
      return false;
    if (!this.d1e_1.equals(tmp0_other_with_cast.d1e_1))
      return false;
    return true;
  };
  function _get_$cachedSerializer__te6jhj($this) {
    return $this.f1g_1.s1();
  }
  function HabitColor$Companion$_anonymous__ia3clc() {
    return createSimpleEnumSerializer('app.todotxt.core.HabitColor', values());
  }
  var HabitColor_EVERGREEN_instance;
  var HabitColor_TERRACOTTA_instance;
  var HabitColor_MOSS_instance;
  var HabitColor_CLAY_instance;
  var HabitColor_SLATE_instance;
  var HabitColor_LILAC_instance;
  function Companion_2() {
    Companion_instance_2 = this;
    this.e1g_1 = toList(get_entries());
    var tmp = this;
    var tmp_0 = LazyThreadSafetyMode_PUBLICATION_getInstance();
    tmp.f1g_1 = lazy(tmp_0, HabitColor$Companion$_anonymous__ia3clc);
  }
  protoOf(Companion_2).y14 = function () {
    return _get_$cachedSerializer__te6jhj(this);
  };
  protoOf(Companion_2).du = function (typeParamsSerializers) {
    return this.y14();
  };
  var Companion_instance_2;
  function Companion_getInstance_2() {
    HabitColor_initEntries();
    if (Companion_instance_2 == null)
      new Companion_2();
    return Companion_instance_2;
  }
  function values() {
    return [HabitColor_EVERGREEN_getInstance(), HabitColor_TERRACOTTA_getInstance(), HabitColor_MOSS_getInstance(), HabitColor_CLAY_getInstance(), HabitColor_SLATE_getInstance(), HabitColor_LILAC_getInstance()];
  }
  function get_entries() {
    if ($ENTRIES == null)
      $ENTRIES = enumEntries(values());
    return $ENTRIES;
  }
  var HabitColor_entriesInitialized;
  function HabitColor_initEntries() {
    if (HabitColor_entriesInitialized)
      return Unit_instance;
    HabitColor_entriesInitialized = true;
    HabitColor_EVERGREEN_instance = new HabitColor('EVERGREEN', 0, '#2f6f61', 47, 111, 97);
    HabitColor_TERRACOTTA_instance = new HabitColor('TERRACOTTA', 1, '#d9784f', 217, 120, 79);
    HabitColor_MOSS_instance = new HabitColor('MOSS', 2, '#748f6c', 116, 143, 108);
    HabitColor_CLAY_instance = new HabitColor('CLAY', 3, '#9f6a4d', 159, 106, 77);
    HabitColor_SLATE_instance = new HabitColor('SLATE', 4, '#536d8d', 83, 109, 141);
    HabitColor_LILAC_instance = new HabitColor('LILAC', 5, '#9a7fbd', 154, 127, 189);
    Companion_getInstance_2();
  }
  var $ENTRIES;
  function HabitColor(name, ordinal, hex, red, green, blue) {
    Enum.call(this, name, ordinal);
    this.m1g_1 = hex;
    this.n1g_1 = red;
    this.o1g_1 = green;
    this.p1g_1 = blue;
  }
  function HabitColor_EVERGREEN_getInstance() {
    HabitColor_initEntries();
    return HabitColor_EVERGREEN_instance;
  }
  function HabitColor_TERRACOTTA_getInstance() {
    HabitColor_initEntries();
    return HabitColor_TERRACOTTA_instance;
  }
  function HabitColor_MOSS_getInstance() {
    HabitColor_initEntries();
    return HabitColor_MOSS_instance;
  }
  function HabitColor_CLAY_getInstance() {
    HabitColor_initEntries();
    return HabitColor_CLAY_instance;
  }
  function HabitColor_SLATE_getInstance() {
    HabitColor_initEntries();
    return HabitColor_SLATE_instance;
  }
  function HabitColor_LILAC_getInstance() {
    HabitColor_initEntries();
    return HabitColor_LILAC_instance;
  }
  function Companion_3() {
  }
  var Companion_instance_3;
  function Companion_getInstance_3() {
    return Companion_instance_3;
  }
  function $serializer_2() {
    $serializer_instance_2 = this;
    var tmp0_serialDesc = new PluginGeneratedSerialDescriptor('app.todotxt.core.WidgetTaskProjection', this, 4);
    tmp0_serialDesc.dt('id', false);
    tmp0_serialDesc.dt('text', false);
    tmp0_serialDesc.dt('done', false);
    tmp0_serialDesc.dt('due', true);
    this.q1g_1 = tmp0_serialDesc;
  }
  protoOf($serializer_2).r1g = function (encoder, value) {
    var tmp0_desc = this.q1g_1;
    var tmp1_output = encoder.pl(tmp0_desc);
    tmp1_output.zm(tmp0_desc, 0, value.s1g_1);
    tmp1_output.en(tmp0_desc, 1, value.t1g_1);
    tmp1_output.wm(tmp0_desc, 2, value.u1g_1);
    if (tmp1_output.mn(tmp0_desc, 3) ? true : !(value.v1g_1 == null)) {
      tmp1_output.in(tmp0_desc, 3, StringSerializer_getInstance(), value.v1g_1);
    }
    tmp1_output.ql(tmp0_desc);
  };
  protoOf($serializer_2).pi = function (encoder, value) {
    return this.r1g(encoder, value instanceof WidgetTaskProjection ? value : THROW_CCE());
  };
  protoOf($serializer_2).qi = function (decoder) {
    var tmp0_desc = this.q1g_1;
    var tmp1_flag = true;
    var tmp2_index = 0;
    var tmp3_bitMask0 = 0;
    var tmp4_local0 = 0;
    var tmp5_local1 = null;
    var tmp6_local2 = false;
    var tmp7_local3 = null;
    var tmp8_input = decoder.pl(tmp0_desc);
    if (tmp8_input.fm()) {
      tmp4_local0 = tmp8_input.ul(tmp0_desc, 0);
      tmp3_bitMask0 = tmp3_bitMask0 | 1;
      tmp5_local1 = tmp8_input.zl(tmp0_desc, 1);
      tmp3_bitMask0 = tmp3_bitMask0 | 2;
      tmp6_local2 = tmp8_input.rl(tmp0_desc, 2);
      tmp3_bitMask0 = tmp3_bitMask0 | 4;
      tmp7_local3 = tmp8_input.dm(tmp0_desc, 3, StringSerializer_getInstance(), tmp7_local3);
      tmp3_bitMask0 = tmp3_bitMask0 | 8;
    } else
      while (tmp1_flag) {
        tmp2_index = tmp8_input.gm(tmp0_desc);
        switch (tmp2_index) {
          case -1:
            tmp1_flag = false;
            break;
          case 0:
            tmp4_local0 = tmp8_input.ul(tmp0_desc, 0);
            tmp3_bitMask0 = tmp3_bitMask0 | 1;
            break;
          case 1:
            tmp5_local1 = tmp8_input.zl(tmp0_desc, 1);
            tmp3_bitMask0 = tmp3_bitMask0 | 2;
            break;
          case 2:
            tmp6_local2 = tmp8_input.rl(tmp0_desc, 2);
            tmp3_bitMask0 = tmp3_bitMask0 | 4;
            break;
          case 3:
            tmp7_local3 = tmp8_input.dm(tmp0_desc, 3, StringSerializer_getInstance(), tmp7_local3);
            tmp3_bitMask0 = tmp3_bitMask0 | 8;
            break;
          default:
            throw UnknownFieldException_init_$Create$(tmp2_index);
        }
      }
    tmp8_input.ql(tmp0_desc);
    return WidgetTaskProjection_init_$Create$(tmp3_bitMask0, tmp4_local0, tmp5_local1, tmp6_local2, tmp7_local3, null);
  };
  protoOf($serializer_2).oi = function () {
    return this.q1g_1;
  };
  protoOf($serializer_2).st = function () {
    // Inline function 'kotlin.arrayOf' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    return [IntSerializer_getInstance(), StringSerializer_getInstance(), BooleanSerializer_getInstance(), get_nullable(StringSerializer_getInstance())];
  };
  var $serializer_instance_2;
  function $serializer_getInstance_2() {
    if ($serializer_instance_2 == null)
      new $serializer_2();
    return $serializer_instance_2;
  }
  function WidgetTaskProjection_init_$Init$(seen0, id, text, done, due, serializationConstructorMarker, $this) {
    if (!(7 === (7 & seen0))) {
      throwMissingFieldException(seen0, 7, $serializer_getInstance_2().q1g_1);
    }
    $this.s1g_1 = id;
    $this.t1g_1 = text;
    $this.u1g_1 = done;
    if (0 === (seen0 & 8))
      $this.v1g_1 = null;
    else
      $this.v1g_1 = due;
    return $this;
  }
  function WidgetTaskProjection_init_$Create$(seen0, id, text, done, due, serializationConstructorMarker) {
    return WidgetTaskProjection_init_$Init$(seen0, id, text, done, due, serializationConstructorMarker, objectCreate(protoOf(WidgetTaskProjection)));
  }
  function WidgetTaskProjection(id, text, done, due) {
    due = due === VOID ? null : due;
    this.s1g_1 = id;
    this.t1g_1 = text;
    this.u1g_1 = done;
    this.v1g_1 = due;
  }
  protoOf(WidgetTaskProjection).toString = function () {
    return 'WidgetTaskProjection(id=' + this.s1g_1 + ', text=' + this.t1g_1 + ', done=' + this.u1g_1 + ', due=' + this.v1g_1 + ')';
  };
  protoOf(WidgetTaskProjection).hashCode = function () {
    var result = this.s1g_1;
    result = imul(result, 31) + getStringHashCode(this.t1g_1) | 0;
    result = imul(result, 31) + getBooleanHashCode(this.u1g_1) | 0;
    result = imul(result, 31) + (this.v1g_1 == null ? 0 : getStringHashCode(this.v1g_1)) | 0;
    return result;
  };
  protoOf(WidgetTaskProjection).equals = function (other) {
    if (this === other)
      return true;
    if (!(other instanceof WidgetTaskProjection))
      return false;
    var tmp0_other_with_cast = other instanceof WidgetTaskProjection ? other : THROW_CCE();
    if (!(this.s1g_1 === tmp0_other_with_cast.s1g_1))
      return false;
    if (!(this.t1g_1 === tmp0_other_with_cast.t1g_1))
      return false;
    if (!(this.u1g_1 === tmp0_other_with_cast.u1g_1))
      return false;
    if (!(this.v1g_1 == tmp0_other_with_cast.v1g_1))
      return false;
    return true;
  };
  function WidgetHabitProjection$Companion$$childSerializers$_anonymous__46ffdh() {
    return new ArrayListSerializer(BooleanSerializer_getInstance());
  }
  function WidgetHabitProjection$Companion$$childSerializers$_anonymous__46ffdh_0() {
    return new ArrayListSerializer(BooleanSerializer_getInstance());
  }
  function WidgetHabitProjection$Companion$$childSerializers$_anonymous__46ffdh_1() {
    return new ArrayListSerializer(new ArrayListSerializer(BooleanSerializer_getInstance()));
  }
  function Companion_4() {
    Companion_instance_4 = this;
    var tmp = this;
    var tmp_0 = LazyThreadSafetyMode_PUBLICATION_getInstance();
    var tmp_1 = lazy(tmp_0, WidgetHabitProjection$Companion$$childSerializers$_anonymous__46ffdh);
    var tmp_2 = LazyThreadSafetyMode_PUBLICATION_getInstance();
    var tmp_3 = lazy(tmp_2, WidgetHabitProjection$Companion$$childSerializers$_anonymous__46ffdh_0);
    var tmp_4 = LazyThreadSafetyMode_PUBLICATION_getInstance();
    // Inline function 'kotlin.arrayOf' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    tmp.w1g_1 = [null, null, null, null, null, null, tmp_1, tmp_3, lazy(tmp_4, WidgetHabitProjection$Companion$$childSerializers$_anonymous__46ffdh_1), null, null];
  }
  var Companion_instance_4;
  function Companion_getInstance_4() {
    if (Companion_instance_4 == null)
      new Companion_4();
    return Companion_instance_4;
  }
  function $serializer_3() {
    $serializer_instance_3 = this;
    var tmp0_serialDesc = new PluginGeneratedSerialDescriptor('app.todotxt.core.WidgetHabitProjection', this, 11);
    tmp0_serialDesc.dt('id', false);
    tmp0_serialDesc.dt('name', false);
    tmp0_serialDesc.dt('color', false);
    tmp0_serialDesc.dt('streak', false);
    tmp0_serialDesc.dt('bestStreak', false);
    tmp0_serialDesc.dt('rate28', false);
    tmp0_serialDesc.dt('last30', true);
    tmp0_serialDesc.dt('last7', true);
    tmp0_serialDesc.dt('last12Weeks', true);
    tmp0_serialDesc.dt('completedToday', false);
    tmp0_serialDesc.dt('reminderTime', true);
    this.x1g_1 = tmp0_serialDesc;
  }
  protoOf($serializer_3).y1g = function (encoder, value) {
    var tmp0_desc = this.x1g_1;
    var tmp1_output = encoder.pl(tmp0_desc);
    var tmp2_cached = Companion_getInstance_4().w1g_1;
    tmp1_output.en(tmp0_desc, 0, value.z1g_1);
    tmp1_output.en(tmp0_desc, 1, value.a1h_1);
    tmp1_output.en(tmp0_desc, 2, value.b1h_1);
    tmp1_output.zm(tmp0_desc, 3, value.c1h_1);
    tmp1_output.zm(tmp0_desc, 4, value.d1h_1);
    tmp1_output.zm(tmp0_desc, 5, value.e1h_1);
    if (tmp1_output.mn(tmp0_desc, 6) ? true : !equals(value.f1h_1, emptyList())) {
      tmp1_output.gn(tmp0_desc, 6, tmp2_cached[6].s1(), value.f1h_1);
    }
    if (tmp1_output.mn(tmp0_desc, 7) ? true : !equals(value.g1h_1, emptyList())) {
      tmp1_output.gn(tmp0_desc, 7, tmp2_cached[7].s1(), value.g1h_1);
    }
    if (tmp1_output.mn(tmp0_desc, 8) ? true : !equals(value.h1h_1, emptyList())) {
      tmp1_output.gn(tmp0_desc, 8, tmp2_cached[8].s1(), value.h1h_1);
    }
    tmp1_output.wm(tmp0_desc, 9, value.i1h_1);
    if (tmp1_output.mn(tmp0_desc, 10) ? true : !(value.j1h_1 == null)) {
      tmp1_output.in(tmp0_desc, 10, StringSerializer_getInstance(), value.j1h_1);
    }
    tmp1_output.ql(tmp0_desc);
  };
  protoOf($serializer_3).pi = function (encoder, value) {
    return this.y1g(encoder, value instanceof WidgetHabitProjection ? value : THROW_CCE());
  };
  protoOf($serializer_3).qi = function (decoder) {
    var tmp0_desc = this.x1g_1;
    var tmp1_flag = true;
    var tmp2_index = 0;
    var tmp3_bitMask0 = 0;
    var tmp4_local0 = null;
    var tmp5_local1 = null;
    var tmp6_local2 = null;
    var tmp7_local3 = 0;
    var tmp8_local4 = 0;
    var tmp9_local5 = 0;
    var tmp10_local6 = null;
    var tmp11_local7 = null;
    var tmp12_local8 = null;
    var tmp13_local9 = false;
    var tmp14_local10 = null;
    var tmp15_input = decoder.pl(tmp0_desc);
    var tmp16_cached = Companion_getInstance_4().w1g_1;
    if (tmp15_input.fm()) {
      tmp4_local0 = tmp15_input.zl(tmp0_desc, 0);
      tmp3_bitMask0 = tmp3_bitMask0 | 1;
      tmp5_local1 = tmp15_input.zl(tmp0_desc, 1);
      tmp3_bitMask0 = tmp3_bitMask0 | 2;
      tmp6_local2 = tmp15_input.zl(tmp0_desc, 2);
      tmp3_bitMask0 = tmp3_bitMask0 | 4;
      tmp7_local3 = tmp15_input.ul(tmp0_desc, 3);
      tmp3_bitMask0 = tmp3_bitMask0 | 8;
      tmp8_local4 = tmp15_input.ul(tmp0_desc, 4);
      tmp3_bitMask0 = tmp3_bitMask0 | 16;
      tmp9_local5 = tmp15_input.ul(tmp0_desc, 5);
      tmp3_bitMask0 = tmp3_bitMask0 | 32;
      tmp10_local6 = tmp15_input.bm(tmp0_desc, 6, tmp16_cached[6].s1(), tmp10_local6);
      tmp3_bitMask0 = tmp3_bitMask0 | 64;
      tmp11_local7 = tmp15_input.bm(tmp0_desc, 7, tmp16_cached[7].s1(), tmp11_local7);
      tmp3_bitMask0 = tmp3_bitMask0 | 128;
      tmp12_local8 = tmp15_input.bm(tmp0_desc, 8, tmp16_cached[8].s1(), tmp12_local8);
      tmp3_bitMask0 = tmp3_bitMask0 | 256;
      tmp13_local9 = tmp15_input.rl(tmp0_desc, 9);
      tmp3_bitMask0 = tmp3_bitMask0 | 512;
      tmp14_local10 = tmp15_input.dm(tmp0_desc, 10, StringSerializer_getInstance(), tmp14_local10);
      tmp3_bitMask0 = tmp3_bitMask0 | 1024;
    } else
      while (tmp1_flag) {
        tmp2_index = tmp15_input.gm(tmp0_desc);
        switch (tmp2_index) {
          case -1:
            tmp1_flag = false;
            break;
          case 0:
            tmp4_local0 = tmp15_input.zl(tmp0_desc, 0);
            tmp3_bitMask0 = tmp3_bitMask0 | 1;
            break;
          case 1:
            tmp5_local1 = tmp15_input.zl(tmp0_desc, 1);
            tmp3_bitMask0 = tmp3_bitMask0 | 2;
            break;
          case 2:
            tmp6_local2 = tmp15_input.zl(tmp0_desc, 2);
            tmp3_bitMask0 = tmp3_bitMask0 | 4;
            break;
          case 3:
            tmp7_local3 = tmp15_input.ul(tmp0_desc, 3);
            tmp3_bitMask0 = tmp3_bitMask0 | 8;
            break;
          case 4:
            tmp8_local4 = tmp15_input.ul(tmp0_desc, 4);
            tmp3_bitMask0 = tmp3_bitMask0 | 16;
            break;
          case 5:
            tmp9_local5 = tmp15_input.ul(tmp0_desc, 5);
            tmp3_bitMask0 = tmp3_bitMask0 | 32;
            break;
          case 6:
            tmp10_local6 = tmp15_input.bm(tmp0_desc, 6, tmp16_cached[6].s1(), tmp10_local6);
            tmp3_bitMask0 = tmp3_bitMask0 | 64;
            break;
          case 7:
            tmp11_local7 = tmp15_input.bm(tmp0_desc, 7, tmp16_cached[7].s1(), tmp11_local7);
            tmp3_bitMask0 = tmp3_bitMask0 | 128;
            break;
          case 8:
            tmp12_local8 = tmp15_input.bm(tmp0_desc, 8, tmp16_cached[8].s1(), tmp12_local8);
            tmp3_bitMask0 = tmp3_bitMask0 | 256;
            break;
          case 9:
            tmp13_local9 = tmp15_input.rl(tmp0_desc, 9);
            tmp3_bitMask0 = tmp3_bitMask0 | 512;
            break;
          case 10:
            tmp14_local10 = tmp15_input.dm(tmp0_desc, 10, StringSerializer_getInstance(), tmp14_local10);
            tmp3_bitMask0 = tmp3_bitMask0 | 1024;
            break;
          default:
            throw UnknownFieldException_init_$Create$(tmp2_index);
        }
      }
    tmp15_input.ql(tmp0_desc);
    return WidgetHabitProjection_init_$Create$(tmp3_bitMask0, tmp4_local0, tmp5_local1, tmp6_local2, tmp7_local3, tmp8_local4, tmp9_local5, tmp10_local6, tmp11_local7, tmp12_local8, tmp13_local9, tmp14_local10, null);
  };
  protoOf($serializer_3).oi = function () {
    return this.x1g_1;
  };
  protoOf($serializer_3).st = function () {
    var tmp0_cached = Companion_getInstance_4().w1g_1;
    // Inline function 'kotlin.arrayOf' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    return [StringSerializer_getInstance(), StringSerializer_getInstance(), StringSerializer_getInstance(), IntSerializer_getInstance(), IntSerializer_getInstance(), IntSerializer_getInstance(), tmp0_cached[6].s1(), tmp0_cached[7].s1(), tmp0_cached[8].s1(), BooleanSerializer_getInstance(), get_nullable(StringSerializer_getInstance())];
  };
  var $serializer_instance_3;
  function $serializer_getInstance_3() {
    if ($serializer_instance_3 == null)
      new $serializer_3();
    return $serializer_instance_3;
  }
  function WidgetHabitProjection_init_$Init$(seen0, id, name, color, streak, bestStreak, rate28, last30, last7, last12Weeks, completedToday, reminderTime, serializationConstructorMarker, $this) {
    if (!(575 === (575 & seen0))) {
      throwMissingFieldException(seen0, 575, $serializer_getInstance_3().x1g_1);
    }
    $this.z1g_1 = id;
    $this.a1h_1 = name;
    $this.b1h_1 = color;
    $this.c1h_1 = streak;
    $this.d1h_1 = bestStreak;
    $this.e1h_1 = rate28;
    if (0 === (seen0 & 64))
      $this.f1h_1 = emptyList();
    else
      $this.f1h_1 = last30;
    if (0 === (seen0 & 128))
      $this.g1h_1 = emptyList();
    else
      $this.g1h_1 = last7;
    if (0 === (seen0 & 256))
      $this.h1h_1 = emptyList();
    else
      $this.h1h_1 = last12Weeks;
    $this.i1h_1 = completedToday;
    if (0 === (seen0 & 1024))
      $this.j1h_1 = null;
    else
      $this.j1h_1 = reminderTime;
    return $this;
  }
  function WidgetHabitProjection_init_$Create$(seen0, id, name, color, streak, bestStreak, rate28, last30, last7, last12Weeks, completedToday, reminderTime, serializationConstructorMarker) {
    return WidgetHabitProjection_init_$Init$(seen0, id, name, color, streak, bestStreak, rate28, last30, last7, last12Weeks, completedToday, reminderTime, serializationConstructorMarker, objectCreate(protoOf(WidgetHabitProjection)));
  }
  function WidgetHabitProjection(id, name, color, streak, bestStreak, rate28, last30, last7, last12Weeks, completedToday, reminderTime) {
    Companion_getInstance_4();
    last30 = last30 === VOID ? emptyList() : last30;
    last7 = last7 === VOID ? emptyList() : last7;
    last12Weeks = last12Weeks === VOID ? emptyList() : last12Weeks;
    reminderTime = reminderTime === VOID ? null : reminderTime;
    this.z1g_1 = id;
    this.a1h_1 = name;
    this.b1h_1 = color;
    this.c1h_1 = streak;
    this.d1h_1 = bestStreak;
    this.e1h_1 = rate28;
    this.f1h_1 = last30;
    this.g1h_1 = last7;
    this.h1h_1 = last12Weeks;
    this.i1h_1 = completedToday;
    this.j1h_1 = reminderTime;
  }
  protoOf(WidgetHabitProjection).toString = function () {
    return 'WidgetHabitProjection(id=' + this.z1g_1 + ', name=' + this.a1h_1 + ', color=' + this.b1h_1 + ', streak=' + this.c1h_1 + ', bestStreak=' + this.d1h_1 + ', rate28=' + this.e1h_1 + ', last30=' + toString(this.f1h_1) + ', last7=' + toString(this.g1h_1) + ', last12Weeks=' + toString(this.h1h_1) + ', completedToday=' + this.i1h_1 + ', reminderTime=' + this.j1h_1 + ')';
  };
  protoOf(WidgetHabitProjection).hashCode = function () {
    var result = getStringHashCode(this.z1g_1);
    result = imul(result, 31) + getStringHashCode(this.a1h_1) | 0;
    result = imul(result, 31) + getStringHashCode(this.b1h_1) | 0;
    result = imul(result, 31) + this.c1h_1 | 0;
    result = imul(result, 31) + this.d1h_1 | 0;
    result = imul(result, 31) + this.e1h_1 | 0;
    result = imul(result, 31) + hashCode(this.f1h_1) | 0;
    result = imul(result, 31) + hashCode(this.g1h_1) | 0;
    result = imul(result, 31) + hashCode(this.h1h_1) | 0;
    result = imul(result, 31) + getBooleanHashCode(this.i1h_1) | 0;
    result = imul(result, 31) + (this.j1h_1 == null ? 0 : getStringHashCode(this.j1h_1)) | 0;
    return result;
  };
  protoOf(WidgetHabitProjection).equals = function (other) {
    if (this === other)
      return true;
    if (!(other instanceof WidgetHabitProjection))
      return false;
    var tmp0_other_with_cast = other instanceof WidgetHabitProjection ? other : THROW_CCE();
    if (!(this.z1g_1 === tmp0_other_with_cast.z1g_1))
      return false;
    if (!(this.a1h_1 === tmp0_other_with_cast.a1h_1))
      return false;
    if (!(this.b1h_1 === tmp0_other_with_cast.b1h_1))
      return false;
    if (!(this.c1h_1 === tmp0_other_with_cast.c1h_1))
      return false;
    if (!(this.d1h_1 === tmp0_other_with_cast.d1h_1))
      return false;
    if (!(this.e1h_1 === tmp0_other_with_cast.e1h_1))
      return false;
    if (!equals(this.f1h_1, tmp0_other_with_cast.f1h_1))
      return false;
    if (!equals(this.g1h_1, tmp0_other_with_cast.g1h_1))
      return false;
    if (!equals(this.h1h_1, tmp0_other_with_cast.h1h_1))
      return false;
    if (!(this.i1h_1 === tmp0_other_with_cast.i1h_1))
      return false;
    if (!(this.j1h_1 == tmp0_other_with_cast.j1h_1))
      return false;
    return true;
  };
  function Companion_5() {
  }
  var Companion_instance_5;
  function Companion_getInstance_5() {
    return Companion_instance_5;
  }
  function $serializer_4() {
    $serializer_instance_4 = this;
    var tmp0_serialDesc = new PluginGeneratedSerialDescriptor('app.todotxt.core.WidgetMomentumProjection', this, 5);
    tmp0_serialDesc.dt('bestStreak', true);
    tmp0_serialDesc.dt('bestHabitName', true);
    tmp0_serialDesc.dt('avgRate28', true);
    tmp0_serialDesc.dt('habitsDoneToday', true);
    tmp0_serialDesc.dt('habitsTotal', true);
    this.k1h_1 = tmp0_serialDesc;
  }
  protoOf($serializer_4).l1h = function (encoder, value) {
    var tmp0_desc = this.k1h_1;
    var tmp1_output = encoder.pl(tmp0_desc);
    if (tmp1_output.mn(tmp0_desc, 0) ? true : !(value.m1h_1 === 0)) {
      tmp1_output.zm(tmp0_desc, 0, value.m1h_1);
    }
    if (tmp1_output.mn(tmp0_desc, 1) ? true : !(value.n1h_1 === '')) {
      tmp1_output.en(tmp0_desc, 1, value.n1h_1);
    }
    if (tmp1_output.mn(tmp0_desc, 2) ? true : !(value.o1h_1 === 0)) {
      tmp1_output.zm(tmp0_desc, 2, value.o1h_1);
    }
    if (tmp1_output.mn(tmp0_desc, 3) ? true : !(value.p1h_1 === 0)) {
      tmp1_output.zm(tmp0_desc, 3, value.p1h_1);
    }
    if (tmp1_output.mn(tmp0_desc, 4) ? true : !(value.q1h_1 === 0)) {
      tmp1_output.zm(tmp0_desc, 4, value.q1h_1);
    }
    tmp1_output.ql(tmp0_desc);
  };
  protoOf($serializer_4).pi = function (encoder, value) {
    return this.l1h(encoder, value instanceof WidgetMomentumProjection ? value : THROW_CCE());
  };
  protoOf($serializer_4).qi = function (decoder) {
    var tmp0_desc = this.k1h_1;
    var tmp1_flag = true;
    var tmp2_index = 0;
    var tmp3_bitMask0 = 0;
    var tmp4_local0 = 0;
    var tmp5_local1 = null;
    var tmp6_local2 = 0;
    var tmp7_local3 = 0;
    var tmp8_local4 = 0;
    var tmp9_input = decoder.pl(tmp0_desc);
    if (tmp9_input.fm()) {
      tmp4_local0 = tmp9_input.ul(tmp0_desc, 0);
      tmp3_bitMask0 = tmp3_bitMask0 | 1;
      tmp5_local1 = tmp9_input.zl(tmp0_desc, 1);
      tmp3_bitMask0 = tmp3_bitMask0 | 2;
      tmp6_local2 = tmp9_input.ul(tmp0_desc, 2);
      tmp3_bitMask0 = tmp3_bitMask0 | 4;
      tmp7_local3 = tmp9_input.ul(tmp0_desc, 3);
      tmp3_bitMask0 = tmp3_bitMask0 | 8;
      tmp8_local4 = tmp9_input.ul(tmp0_desc, 4);
      tmp3_bitMask0 = tmp3_bitMask0 | 16;
    } else
      while (tmp1_flag) {
        tmp2_index = tmp9_input.gm(tmp0_desc);
        switch (tmp2_index) {
          case -1:
            tmp1_flag = false;
            break;
          case 0:
            tmp4_local0 = tmp9_input.ul(tmp0_desc, 0);
            tmp3_bitMask0 = tmp3_bitMask0 | 1;
            break;
          case 1:
            tmp5_local1 = tmp9_input.zl(tmp0_desc, 1);
            tmp3_bitMask0 = tmp3_bitMask0 | 2;
            break;
          case 2:
            tmp6_local2 = tmp9_input.ul(tmp0_desc, 2);
            tmp3_bitMask0 = tmp3_bitMask0 | 4;
            break;
          case 3:
            tmp7_local3 = tmp9_input.ul(tmp0_desc, 3);
            tmp3_bitMask0 = tmp3_bitMask0 | 8;
            break;
          case 4:
            tmp8_local4 = tmp9_input.ul(tmp0_desc, 4);
            tmp3_bitMask0 = tmp3_bitMask0 | 16;
            break;
          default:
            throw UnknownFieldException_init_$Create$(tmp2_index);
        }
      }
    tmp9_input.ql(tmp0_desc);
    return WidgetMomentumProjection_init_$Create$(tmp3_bitMask0, tmp4_local0, tmp5_local1, tmp6_local2, tmp7_local3, tmp8_local4, null);
  };
  protoOf($serializer_4).oi = function () {
    return this.k1h_1;
  };
  protoOf($serializer_4).st = function () {
    // Inline function 'kotlin.arrayOf' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    return [IntSerializer_getInstance(), StringSerializer_getInstance(), IntSerializer_getInstance(), IntSerializer_getInstance(), IntSerializer_getInstance()];
  };
  var $serializer_instance_4;
  function $serializer_getInstance_4() {
    if ($serializer_instance_4 == null)
      new $serializer_4();
    return $serializer_instance_4;
  }
  function WidgetMomentumProjection_init_$Init$(seen0, bestStreak, bestHabitName, avgRate28, habitsDoneToday, habitsTotal, serializationConstructorMarker, $this) {
    if (!(0 === (0 & seen0))) {
      throwMissingFieldException(seen0, 0, $serializer_getInstance_4().k1h_1);
    }
    if (0 === (seen0 & 1))
      $this.m1h_1 = 0;
    else
      $this.m1h_1 = bestStreak;
    if (0 === (seen0 & 2))
      $this.n1h_1 = '';
    else
      $this.n1h_1 = bestHabitName;
    if (0 === (seen0 & 4))
      $this.o1h_1 = 0;
    else
      $this.o1h_1 = avgRate28;
    if (0 === (seen0 & 8))
      $this.p1h_1 = 0;
    else
      $this.p1h_1 = habitsDoneToday;
    if (0 === (seen0 & 16))
      $this.q1h_1 = 0;
    else
      $this.q1h_1 = habitsTotal;
    return $this;
  }
  function WidgetMomentumProjection_init_$Create$(seen0, bestStreak, bestHabitName, avgRate28, habitsDoneToday, habitsTotal, serializationConstructorMarker) {
    return WidgetMomentumProjection_init_$Init$(seen0, bestStreak, bestHabitName, avgRate28, habitsDoneToday, habitsTotal, serializationConstructorMarker, objectCreate(protoOf(WidgetMomentumProjection)));
  }
  function WidgetMomentumProjection(bestStreak, bestHabitName, avgRate28, habitsDoneToday, habitsTotal) {
    bestStreak = bestStreak === VOID ? 0 : bestStreak;
    bestHabitName = bestHabitName === VOID ? '' : bestHabitName;
    avgRate28 = avgRate28 === VOID ? 0 : avgRate28;
    habitsDoneToday = habitsDoneToday === VOID ? 0 : habitsDoneToday;
    habitsTotal = habitsTotal === VOID ? 0 : habitsTotal;
    this.m1h_1 = bestStreak;
    this.n1h_1 = bestHabitName;
    this.o1h_1 = avgRate28;
    this.p1h_1 = habitsDoneToday;
    this.q1h_1 = habitsTotal;
  }
  protoOf(WidgetMomentumProjection).toString = function () {
    return 'WidgetMomentumProjection(bestStreak=' + this.m1h_1 + ', bestHabitName=' + this.n1h_1 + ', avgRate28=' + this.o1h_1 + ', habitsDoneToday=' + this.p1h_1 + ', habitsTotal=' + this.q1h_1 + ')';
  };
  protoOf(WidgetMomentumProjection).hashCode = function () {
    var result = this.m1h_1;
    result = imul(result, 31) + getStringHashCode(this.n1h_1) | 0;
    result = imul(result, 31) + this.o1h_1 | 0;
    result = imul(result, 31) + this.p1h_1 | 0;
    result = imul(result, 31) + this.q1h_1 | 0;
    return result;
  };
  protoOf(WidgetMomentumProjection).equals = function (other) {
    if (this === other)
      return true;
    if (!(other instanceof WidgetMomentumProjection))
      return false;
    var tmp0_other_with_cast = other instanceof WidgetMomentumProjection ? other : THROW_CCE();
    if (!(this.m1h_1 === tmp0_other_with_cast.m1h_1))
      return false;
    if (!(this.n1h_1 === tmp0_other_with_cast.n1h_1))
      return false;
    if (!(this.o1h_1 === tmp0_other_with_cast.o1h_1))
      return false;
    if (!(this.p1h_1 === tmp0_other_with_cast.p1h_1))
      return false;
    if (!(this.q1h_1 === tmp0_other_with_cast.q1h_1))
      return false;
    return true;
  };
  function WidgetPayloadProjection$Companion$$childSerializers$_anonymous__oh07o1() {
    return new ArrayListSerializer($serializer_getInstance_2());
  }
  function WidgetPayloadProjection$Companion$$childSerializers$_anonymous__oh07o1_0() {
    return new ArrayListSerializer($serializer_getInstance_3());
  }
  function Companion_6() {
    Companion_instance_6 = this;
    var tmp = this;
    var tmp_0 = LazyThreadSafetyMode_PUBLICATION_getInstance();
    var tmp_1 = lazy(tmp_0, WidgetPayloadProjection$Companion$$childSerializers$_anonymous__oh07o1);
    var tmp_2 = LazyThreadSafetyMode_PUBLICATION_getInstance();
    // Inline function 'kotlin.arrayOf' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    tmp.r1h_1 = [null, tmp_1, lazy(tmp_2, WidgetPayloadProjection$Companion$$childSerializers$_anonymous__oh07o1_0), null];
  }
  var Companion_instance_6;
  function Companion_getInstance_6() {
    if (Companion_instance_6 == null)
      new Companion_6();
    return Companion_instance_6;
  }
  function $serializer_5() {
    $serializer_instance_5 = this;
    var tmp0_serialDesc = new PluginGeneratedSerialDescriptor('app.todotxt.core.WidgetPayloadProjection', this, 4);
    tmp0_serialDesc.dt('date', false);
    tmp0_serialDesc.dt('tasks', true);
    tmp0_serialDesc.dt('habits', true);
    tmp0_serialDesc.dt('momentum', true);
    this.s1h_1 = tmp0_serialDesc;
  }
  protoOf($serializer_5).t1h = function (encoder, value) {
    var tmp0_desc = this.s1h_1;
    var tmp1_output = encoder.pl(tmp0_desc);
    var tmp2_cached = Companion_getInstance_6().r1h_1;
    tmp1_output.en(tmp0_desc, 0, value.u1h_1);
    if (tmp1_output.mn(tmp0_desc, 1) ? true : !equals(value.v1h_1, emptyList())) {
      tmp1_output.gn(tmp0_desc, 1, tmp2_cached[1].s1(), value.v1h_1);
    }
    if (tmp1_output.mn(tmp0_desc, 2) ? true : !equals(value.w1h_1, emptyList())) {
      tmp1_output.gn(tmp0_desc, 2, tmp2_cached[2].s1(), value.w1h_1);
    }
    if (tmp1_output.mn(tmp0_desc, 3) ? true : !value.x1h_1.equals(new WidgetMomentumProjection())) {
      tmp1_output.gn(tmp0_desc, 3, $serializer_getInstance_4(), value.x1h_1);
    }
    tmp1_output.ql(tmp0_desc);
  };
  protoOf($serializer_5).pi = function (encoder, value) {
    return this.t1h(encoder, value instanceof WidgetPayloadProjection ? value : THROW_CCE());
  };
  protoOf($serializer_5).qi = function (decoder) {
    var tmp0_desc = this.s1h_1;
    var tmp1_flag = true;
    var tmp2_index = 0;
    var tmp3_bitMask0 = 0;
    var tmp4_local0 = null;
    var tmp5_local1 = null;
    var tmp6_local2 = null;
    var tmp7_local3 = null;
    var tmp8_input = decoder.pl(tmp0_desc);
    var tmp9_cached = Companion_getInstance_6().r1h_1;
    if (tmp8_input.fm()) {
      tmp4_local0 = tmp8_input.zl(tmp0_desc, 0);
      tmp3_bitMask0 = tmp3_bitMask0 | 1;
      tmp5_local1 = tmp8_input.bm(tmp0_desc, 1, tmp9_cached[1].s1(), tmp5_local1);
      tmp3_bitMask0 = tmp3_bitMask0 | 2;
      tmp6_local2 = tmp8_input.bm(tmp0_desc, 2, tmp9_cached[2].s1(), tmp6_local2);
      tmp3_bitMask0 = tmp3_bitMask0 | 4;
      tmp7_local3 = tmp8_input.bm(tmp0_desc, 3, $serializer_getInstance_4(), tmp7_local3);
      tmp3_bitMask0 = tmp3_bitMask0 | 8;
    } else
      while (tmp1_flag) {
        tmp2_index = tmp8_input.gm(tmp0_desc);
        switch (tmp2_index) {
          case -1:
            tmp1_flag = false;
            break;
          case 0:
            tmp4_local0 = tmp8_input.zl(tmp0_desc, 0);
            tmp3_bitMask0 = tmp3_bitMask0 | 1;
            break;
          case 1:
            tmp5_local1 = tmp8_input.bm(tmp0_desc, 1, tmp9_cached[1].s1(), tmp5_local1);
            tmp3_bitMask0 = tmp3_bitMask0 | 2;
            break;
          case 2:
            tmp6_local2 = tmp8_input.bm(tmp0_desc, 2, tmp9_cached[2].s1(), tmp6_local2);
            tmp3_bitMask0 = tmp3_bitMask0 | 4;
            break;
          case 3:
            tmp7_local3 = tmp8_input.bm(tmp0_desc, 3, $serializer_getInstance_4(), tmp7_local3);
            tmp3_bitMask0 = tmp3_bitMask0 | 8;
            break;
          default:
            throw UnknownFieldException_init_$Create$(tmp2_index);
        }
      }
    tmp8_input.ql(tmp0_desc);
    return WidgetPayloadProjection_init_$Create$(tmp3_bitMask0, tmp4_local0, tmp5_local1, tmp6_local2, tmp7_local3, null);
  };
  protoOf($serializer_5).oi = function () {
    return this.s1h_1;
  };
  protoOf($serializer_5).st = function () {
    var tmp0_cached = Companion_getInstance_6().r1h_1;
    // Inline function 'kotlin.arrayOf' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    return [StringSerializer_getInstance(), tmp0_cached[1].s1(), tmp0_cached[2].s1(), $serializer_getInstance_4()];
  };
  var $serializer_instance_5;
  function $serializer_getInstance_5() {
    if ($serializer_instance_5 == null)
      new $serializer_5();
    return $serializer_instance_5;
  }
  function WidgetPayloadProjection_init_$Init$(seen0, date, tasks, habits, momentum, serializationConstructorMarker, $this) {
    if (!(1 === (1 & seen0))) {
      throwMissingFieldException(seen0, 1, $serializer_getInstance_5().s1h_1);
    }
    $this.u1h_1 = date;
    if (0 === (seen0 & 2))
      $this.v1h_1 = emptyList();
    else
      $this.v1h_1 = tasks;
    if (0 === (seen0 & 4))
      $this.w1h_1 = emptyList();
    else
      $this.w1h_1 = habits;
    if (0 === (seen0 & 8))
      $this.x1h_1 = new WidgetMomentumProjection();
    else
      $this.x1h_1 = momentum;
    return $this;
  }
  function WidgetPayloadProjection_init_$Create$(seen0, date, tasks, habits, momentum, serializationConstructorMarker) {
    return WidgetPayloadProjection_init_$Init$(seen0, date, tasks, habits, momentum, serializationConstructorMarker, objectCreate(protoOf(WidgetPayloadProjection)));
  }
  function WidgetPayloadProjection(date, tasks, habits, momentum) {
    Companion_getInstance_6();
    tasks = tasks === VOID ? emptyList() : tasks;
    habits = habits === VOID ? emptyList() : habits;
    momentum = momentum === VOID ? new WidgetMomentumProjection() : momentum;
    this.u1h_1 = date;
    this.v1h_1 = tasks;
    this.w1h_1 = habits;
    this.x1h_1 = momentum;
  }
  protoOf(WidgetPayloadProjection).toString = function () {
    return 'WidgetPayloadProjection(date=' + this.u1h_1 + ', tasks=' + toString(this.v1h_1) + ', habits=' + toString(this.w1h_1) + ', momentum=' + this.x1h_1.toString() + ')';
  };
  protoOf(WidgetPayloadProjection).hashCode = function () {
    var result = getStringHashCode(this.u1h_1);
    result = imul(result, 31) + hashCode(this.v1h_1) | 0;
    result = imul(result, 31) + hashCode(this.w1h_1) | 0;
    result = imul(result, 31) + this.x1h_1.hashCode() | 0;
    return result;
  };
  protoOf(WidgetPayloadProjection).equals = function (other) {
    if (this === other)
      return true;
    if (!(other instanceof WidgetPayloadProjection))
      return false;
    var tmp0_other_with_cast = other instanceof WidgetPayloadProjection ? other : THROW_CCE();
    if (!(this.u1h_1 === tmp0_other_with_cast.u1h_1))
      return false;
    if (!equals(this.v1h_1, tmp0_other_with_cast.v1h_1))
      return false;
    if (!equals(this.w1h_1, tmp0_other_with_cast.w1h_1))
      return false;
    if (!this.x1h_1.equals(tmp0_other_with_cast.x1h_1))
      return false;
    return true;
  };
  function WidgetData() {
    this.y1h_1 = 50;
    this.z1h_1 = 12;
  }
  protoOf(WidgetData).a1i = function (tasks, habits, today, maxTasks) {
    // Inline function 'kotlin.collections.filter' call
    // Inline function 'kotlin.collections.filterTo' call
    var destination = ArrayList_init_$Create$_0();
    var _iterator__ex2g4s = habits.g();
    while (_iterator__ex2g4s.h()) {
      var element = _iterator__ex2g4s.i();
      if (!element.b1e_1) {
        destination.e(element);
      }
    }
    var activeHabits = destination;
    // Inline function 'kotlin.collections.map' call
    // Inline function 'kotlin.collections.mapTo' call
    var destination_0 = ArrayList_init_$Create$(collectionSizeOrDefault(activeHabits, 10));
    var _iterator__ex2g4s_0 = activeHabits.g();
    while (_iterator__ex2g4s_0.h()) {
      var item = _iterator__ex2g4s_0.i();
      var tmp$ret$3 = WidgetData_instance.b1i(item, today);
      destination_0.e(tmp$ret$3);
    }
    var projectedHabits = destination_0;
    // Inline function 'kotlin.collections.map' call
    var this_0 = take(tasks, maxTasks);
    // Inline function 'kotlin.collections.mapTo' call
    var destination_1 = ArrayList_init_$Create$(collectionSizeOrDefault(this_0, 10));
    var _iterator__ex2g4s_1 = this_0.g();
    while (_iterator__ex2g4s_1.h()) {
      var item_0 = _iterator__ex2g4s_1.i();
      var tmp$ret$6 = new WidgetTaskProjection(item_0.g1f_1, item_0.h1f_1, item_0.j1f_1, item_0.n1f_1);
      destination_1.e(tmp$ret$6);
    }
    return new WidgetPayloadProjection(today, destination_1, projectedHabits, this.c1i(projectedHabits));
  };
  protoOf(WidgetData).d1i = function (tasks, habits, today, maxTasks, $super) {
    today = today === VOID ? HabitUtils_instance.g1e() : today;
    maxTasks = maxTasks === VOID ? 50 : maxTasks;
    return $super === VOID ? this.a1i(tasks, habits, today, maxTasks) : $super.a1i.call(this, tasks, habits, today, maxTasks);
  };
  protoOf(WidgetData).b1i = function (habit, today) {
    var heatmap = HabitUtils_instance.n1e(habit, 12);
    var completed = toSet(habit.a1e_1);
    var tmp = HabitUtils_instance.i1e(habit);
    var tmp_0 = HabitUtils_instance.j1e(habit);
    var tmp_1 = HabitUtils_instance.l1e(habit);
    // Inline function 'kotlin.collections.map' call
    var this_0 = HabitUtils_instance.h1e(30);
    // Inline function 'kotlin.collections.mapTo' call
    var destination = ArrayList_init_$Create$(collectionSizeOrDefault(this_0, 10));
    var _iterator__ex2g4s = this_0.g();
    while (_iterator__ex2g4s.h()) {
      var item = _iterator__ex2g4s.i();
      var tmp$ret$0 = completed.p1(item);
      destination.e(tmp$ret$0);
    }
    var tmp_2 = destination;
    // Inline function 'kotlin.collections.map' call
    var this_1 = HabitUtils_instance.h1e(7);
    // Inline function 'kotlin.collections.mapTo' call
    var destination_0 = ArrayList_init_$Create$(collectionSizeOrDefault(this_1, 10));
    var _iterator__ex2g4s_0 = this_1.g();
    while (_iterator__ex2g4s_0.h()) {
      var item_0 = _iterator__ex2g4s_0.i();
      var tmp$ret$3 = completed.p1(item_0);
      destination_0.e(tmp$ret$3);
    }
    var tmp_3 = destination_0;
    // Inline function 'kotlin.collections.map' call
    // Inline function 'kotlin.collections.mapTo' call
    var destination_1 = ArrayList_init_$Create$(collectionSizeOrDefault(heatmap, 10));
    var _iterator__ex2g4s_1 = heatmap.g();
    while (_iterator__ex2g4s_1.h()) {
      var item_1 = _iterator__ex2g4s_1.i();
      // Inline function 'kotlin.collections.map' call
      // Inline function 'kotlin.collections.mapTo' call
      var destination_2 = ArrayList_init_$Create$(collectionSizeOrDefault(item_1, 10));
      var _iterator__ex2g4s_2 = item_1.g();
      while (_iterator__ex2g4s_2.h()) {
        var item_2 = _iterator__ex2g4s_2.i();
        var tmp$ret$6 = !(item_2 == null) && completed.p1(item_2);
        destination_2.e(tmp$ret$6);
      }
      destination_1.e(destination_2);
    }
    return new WidgetHabitProjection(habit.v1d_1, habit.w1d_1, habit.x1d_1.m1g_1, tmp, tmp_0, tmp_1, tmp_2, tmp_3, destination_1, completed.p1(today), habit.y1d_1 ? habit.z1d_1 : null);
  };
  protoOf(WidgetData).c1i = function (habits) {
    if (habits.p())
      return new WidgetMomentumProjection();
    var tmp$ret$0;
    $l$block: {
      // Inline function 'kotlin.collections.maxBy' call
      var iterator = habits.g();
      if (!iterator.h())
        throw NoSuchElementException_init_$Create$();
      var maxElem = iterator.i();
      if (!iterator.h()) {
        tmp$ret$0 = maxElem;
        break $l$block;
      }
      var maxValue = maxElem.c1h_1;
      do {
        var e = iterator.i();
        var v = e.c1h_1;
        if (compareTo(maxValue, v) < 0) {
          maxElem = e;
          maxValue = v;
        }
      }
       while (iterator.h());
      tmp$ret$0 = maxElem;
    }
    var best = tmp$ret$0;
    // Inline function 'kotlin.collections.map' call
    // Inline function 'kotlin.collections.mapTo' call
    var destination = ArrayList_init_$Create$(collectionSizeOrDefault(habits, 10));
    var _iterator__ex2g4s = habits.g();
    while (_iterator__ex2g4s.h()) {
      var item = _iterator__ex2g4s.i();
      var tmp$ret$3 = item.e1h_1;
      destination.e(tmp$ret$3);
    }
    var avgRate = numberToInt(average(destination));
    var tmp$ret$6;
    $l$block_0: {
      // Inline function 'kotlin.collections.count' call
      var tmp;
      if (isInterface(habits, Collection)) {
        tmp = habits.p();
      } else {
        tmp = false;
      }
      if (tmp) {
        tmp$ret$6 = 0;
        break $l$block_0;
      }
      var count = 0;
      var _iterator__ex2g4s_0 = habits.g();
      while (_iterator__ex2g4s_0.h()) {
        var element = _iterator__ex2g4s_0.i();
        if (element.i1h_1) {
          count = count + 1 | 0;
          checkCountOverflow(count);
        }
      }
      tmp$ret$6 = count;
    }
    return new WidgetMomentumProjection(best.c1h_1, best.a1h_1, avgRate, tmp$ret$6, habits.j());
  };
  var WidgetData_instance;
  function WidgetData_getInstance() {
    return WidgetData_instance;
  }
  function get_json() {
    _init_properties_CoreEntry_kt__6vdwo1();
    return json;
  }
  var json;
  function parseTodoContentJs(raw) {
    _init_properties_CoreEntry_kt__6vdwo1();
    var parsed = TodoParser_getInstance().q1f(raw);
    // Inline function 'kotlinx.serialization.encodeToString' call
    var this_0 = get_json();
    // Inline function 'kotlinx.serialization.serializer' call
    var this_1 = this_0.em();
    // Inline function 'kotlinx.serialization.internal.cast' call
    var this_2 = serializer(this_1, createKType(getKClass(ParsedTodoContent), arrayOf([]), false));
    var tmp$ret$1 = isInterface(this_2, KSerializer) ? this_2 : THROW_CCE();
    return this_0.r12(tmp$ret$1, parsed);
  }
  function streakForHabitJs(habitJson) {
    _init_properties_CoreEntry_kt__6vdwo1();
    // Inline function 'kotlinx.serialization.json.Json.decodeFromString' call
    var this_0 = get_json();
    // Inline function 'kotlinx.serialization.serializer' call
    var this_1 = this_0.em();
    // Inline function 'kotlinx.serialization.internal.cast' call
    var this_2 = serializer(this_1, createKType(getKClass(Habit), arrayOf([]), false));
    var tmp$ret$1 = isInterface(this_2, KSerializer) ? this_2 : THROW_CCE();
    var habit = this_0.s12(tmp$ret$1, habitJson);
    var streak = HabitUtils_instance.i1e(habit);
    return streak.toString();
  }
  function momentumForHabitJs(habitJson) {
    _init_properties_CoreEntry_kt__6vdwo1();
    // Inline function 'kotlinx.serialization.json.Json.decodeFromString' call
    var this_0 = get_json();
    // Inline function 'kotlinx.serialization.serializer' call
    var this_1 = this_0.em();
    // Inline function 'kotlinx.serialization.internal.cast' call
    var this_2 = serializer(this_1, createKType(getKClass(Habit), arrayOf([]), false));
    var tmp$ret$1 = isInterface(this_2, KSerializer) ? this_2 : THROW_CCE();
    var habit = this_0.s12(tmp$ret$1, habitJson);
    var momentum = HabitUtils_instance.m1e(habit);
    var tmp4 = get_json();
    // Inline function 'kotlin.collections.map' call
    // Inline function 'kotlin.collections.mapTo' call
    var destination = ArrayList_init_$Create$(collectionSizeOrDefault(momentum, 10));
    var _iterator__ex2g4s = momentum.g();
    while (_iterator__ex2g4s.h()) {
      var item = _iterator__ex2g4s.i();
      var tmp$ret$3 = listOf([item.hd_1, item.id_1]);
      destination.e(tmp$ret$3);
    }
    // Inline function 'kotlinx.serialization.encodeToString' call
    // Inline function 'kotlinx.serialization.serializer' call
    var this_3 = tmp4.em();
    // Inline function 'kotlinx.serialization.internal.cast' call
    var this_4 = serializer(this_3, createKType(getKClass(KtList), arrayOf([createInvariantKTypeProjection(createKType(getKClass(KtList), arrayOf([createInvariantKTypeProjection(createKType(getKClass(Comparable), arrayOf([createInvariantKTypeProjection(createKType(PrimitiveClasses_getInstance().s9(), arrayOf([]), false))]), false))]), false))]), false));
    var tmp$ret$7 = isInterface(this_4, KSerializer) ? this_4 : THROW_CCE();
    return tmp4.r12(tmp$ret$7, destination);
  }
  function heatmapForHabitJs(habitJson) {
    _init_properties_CoreEntry_kt__6vdwo1();
    // Inline function 'kotlinx.serialization.json.Json.decodeFromString' call
    var this_0 = get_json();
    // Inline function 'kotlinx.serialization.serializer' call
    var this_1 = this_0.em();
    // Inline function 'kotlinx.serialization.internal.cast' call
    var this_2 = serializer(this_1, createKType(getKClass(Habit), arrayOf([]), false));
    var tmp$ret$1 = isInterface(this_2, KSerializer) ? this_2 : THROW_CCE();
    var habit = this_0.s12(tmp$ret$1, habitJson);
    var heatmap = HabitUtils_instance.o1e(habit);
    // Inline function 'kotlinx.serialization.encodeToString' call
    var this_3 = get_json();
    // Inline function 'kotlinx.serialization.serializer' call
    var this_4 = this_3.em();
    // Inline function 'kotlinx.serialization.internal.cast' call
    var this_5 = serializer(this_4, createKType(getKClass(KtList), arrayOf([createInvariantKTypeProjection(createKType(getKClass(KtList), arrayOf([createInvariantKTypeProjection(createKType(PrimitiveClasses_getInstance().aa(), arrayOf([]), true))]), false))]), false));
    var tmp$ret$4 = isInterface(this_5, KSerializer) ? this_5 : THROW_CCE();
    return this_3.r12(tmp$ret$4, heatmap);
  }
  function toggleHabitDateJs(habitJson, date) {
    _init_properties_CoreEntry_kt__6vdwo1();
    // Inline function 'kotlinx.serialization.json.Json.decodeFromString' call
    var this_0 = get_json();
    // Inline function 'kotlinx.serialization.serializer' call
    var this_1 = this_0.em();
    // Inline function 'kotlinx.serialization.internal.cast' call
    var this_2 = serializer(this_1, createKType(getKClass(Habit), arrayOf([]), false));
    var tmp$ret$1 = isInterface(this_2, KSerializer) ? this_2 : THROW_CCE();
    var habit = this_0.s12(tmp$ret$1, habitJson);
    var toggled = HabitUtils_instance.p1e(habit, date);
    // Inline function 'kotlinx.serialization.encodeToString' call
    var this_3 = get_json();
    // Inline function 'kotlinx.serialization.serializer' call
    var this_4 = this_3.em();
    // Inline function 'kotlinx.serialization.internal.cast' call
    var this_5 = serializer(this_4, createKType(getKClass(Habit), arrayOf([]), false));
    var tmp$ret$4 = isInterface(this_5, KSerializer) ? this_5 : THROW_CCE();
    return this_3.r12(tmp$ret$4, toggled);
  }
  function mergeHabitsJs(localJson, remoteJson) {
    _init_properties_CoreEntry_kt__6vdwo1();
    // Inline function 'kotlinx.serialization.json.Json.decodeFromString' call
    var this_0 = get_json();
    // Inline function 'kotlinx.serialization.serializer' call
    var this_1 = this_0.em();
    // Inline function 'kotlinx.serialization.internal.cast' call
    var this_2 = serializer(this_1, createKType(getKClass(KtList), arrayOf([createInvariantKTypeProjection(createKType(getKClass(Habit), arrayOf([]), false))]), false));
    var tmp$ret$1 = isInterface(this_2, KSerializer) ? this_2 : THROW_CCE();
    var local = this_0.s12(tmp$ret$1, localJson);
    // Inline function 'kotlinx.serialization.json.Json.decodeFromString' call
    var this_3 = get_json();
    // Inline function 'kotlinx.serialization.serializer' call
    var this_4 = this_3.em();
    // Inline function 'kotlinx.serialization.internal.cast' call
    var this_5 = serializer(this_4, createKType(getKClass(KtList), arrayOf([createInvariantKTypeProjection(createKType(getKClass(Habit), arrayOf([]), false))]), false));
    var tmp$ret$4 = isInterface(this_5, KSerializer) ? this_5 : THROW_CCE();
    var remote = this_3.s12(tmp$ret$4, remoteJson);
    var tmp4 = get_json();
    // Inline function 'kotlinx.serialization.encodeToString' call
    var value = HabitMerge_instance.f1e(local, remote);
    // Inline function 'kotlinx.serialization.serializer' call
    var this_6 = tmp4.em();
    // Inline function 'kotlinx.serialization.internal.cast' call
    var this_7 = serializer(this_6, createKType(getKClass(KtList), arrayOf([createInvariantKTypeProjection(createKType(getKClass(Habit), arrayOf([]), false))]), false));
    var tmp$ret$7 = isInterface(this_7, KSerializer) ? this_7 : THROW_CCE();
    return tmp4.r12(tmp$ret$7, value);
  }
  function widgetPayloadJs(tasksJson, habitsJson) {
    _init_properties_CoreEntry_kt__6vdwo1();
    // Inline function 'kotlinx.serialization.json.Json.decodeFromString' call
    var this_0 = get_json();
    // Inline function 'kotlinx.serialization.serializer' call
    var this_1 = this_0.em();
    // Inline function 'kotlinx.serialization.internal.cast' call
    var this_2 = serializer(this_1, createKType(getKClass(KtList), arrayOf([createInvariantKTypeProjection(createKType(getKClass(Task), arrayOf([]), false))]), false));
    var tmp$ret$1 = isInterface(this_2, KSerializer) ? this_2 : THROW_CCE();
    var tasks = this_0.s12(tmp$ret$1, tasksJson);
    // Inline function 'kotlinx.serialization.json.Json.decodeFromString' call
    var this_3 = get_json();
    // Inline function 'kotlinx.serialization.serializer' call
    var this_4 = this_3.em();
    // Inline function 'kotlinx.serialization.internal.cast' call
    var this_5 = serializer(this_4, createKType(getKClass(KtList), arrayOf([createInvariantKTypeProjection(createKType(getKClass(Habit), arrayOf([]), false))]), false));
    var tmp$ret$4 = isInterface(this_5, KSerializer) ? this_5 : THROW_CCE();
    var habits = this_3.s12(tmp$ret$4, habitsJson);
    var tmp4 = get_json();
    // Inline function 'kotlinx.serialization.encodeToString' call
    var value = WidgetData_instance.d1i(tasks, habits);
    // Inline function 'kotlinx.serialization.serializer' call
    var this_6 = tmp4.em();
    // Inline function 'kotlinx.serialization.internal.cast' call
    var this_7 = serializer(this_6, createKType(getKClass(WidgetPayloadProjection), arrayOf([]), false));
    var tmp$ret$7 = isInterface(this_7, KSerializer) ? this_7 : THROW_CCE();
    return tmp4.r12(tmp$ret$7, value);
  }
  function main() {
    _init_properties_CoreEntry_kt__6vdwo1();
    println('TodoTxt Core JS module loaded');
    println('Exports: parseTodoContentJs, streakForHabitJs, momentumForHabitJs, heatmapForHabitJs, mergeHabitsJs');
  }
  function json$lambda($this$Json) {
    _init_properties_CoreEntry_kt__6vdwo1();
    $this$Json.k13_1 = true;
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
  function todayString() {
    return iso(new Date());
  }
  function addDaysString(base, days) {
    var parts = split(base, ['-']);
    var d = new Date(toInt(parts.k(0)), toInt(parts.k(1)) - 1 | 0, toInt(parts.k(2)) + days | 0);
    return iso(d);
  }
  function iso(_this__u8e3s4) {
    var y = padStart(_this__u8e3s4.getFullYear().toString(), 4, _Char___init__impl__6a9atx(48));
    var m = padStart((_this__u8e3s4.getMonth() + 1 | 0).toString(), 2, _Char___init__impl__6a9atx(48));
    var day = padStart(_this__u8e3s4.getDate().toString(), 2, _Char___init__impl__6a9atx(48));
    return y + '-' + m + '-' + day;
  }
  function currentTimeMillis() {
    // Inline function 'kotlin.js.unsafeCast' call
    var tmp$ret$0 = Date.now();
    return numberToLong(tmp$ret$0);
  }
  //region block: post-declaration
  protoOf($serializer).tt = typeParametersSerializers;
  protoOf($serializer_0).tt = typeParametersSerializers;
  protoOf($serializer_1).tt = typeParametersSerializers;
  protoOf($serializer_2).tt = typeParametersSerializers;
  protoOf($serializer_3).tt = typeParametersSerializers;
  protoOf($serializer_4).tt = typeParametersSerializers;
  protoOf($serializer_5).tt = typeParametersSerializers;
  //endregion
  //region block: init
  HabitMerge_instance = new HabitMerge();
  HabitUtils_instance = new HabitUtils();
  Companion_instance_3 = new Companion_3();
  Companion_instance_5 = new Companion_5();
  WidgetData_instance = new WidgetData();
  //endregion
  //region block: exports
  function $jsExportAll$(_) {
    var $app = _.app || (_.app = {});
    var $app$todotxt = $app.todotxt || ($app.todotxt = {});
    var $app$todotxt$core = $app$todotxt.core || ($app$todotxt.core = {});
    $app$todotxt$core.parseTodoContentJs = parseTodoContentJs;
    $app$todotxt$core.streakForHabitJs = streakForHabitJs;
    $app$todotxt$core.momentumForHabitJs = momentumForHabitJs;
    $app$todotxt$core.heatmapForHabitJs = heatmapForHabitJs;
    $app$todotxt$core.toggleHabitDateJs = toggleHabitDateJs;
    $app$todotxt$core.mergeHabitsJs = mergeHabitsJs;
    $app$todotxt$core.widgetPayloadJs = widgetPayloadJs;
  }
  $jsExportAll$(_);
  //endregion
  mainWrapper();
  return _;
}(module.exports, require('./kotlin-kotlin-stdlib.js'), require('./kotlinx-serialization-kotlinx-serialization-core.js'), require('./kotlinx-serialization-kotlinx-serialization-json.js')));

//# sourceMappingURL=todotxt-native-core.js.map
