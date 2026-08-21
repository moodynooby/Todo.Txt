# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# If your project uses WebView with JS, uncomment the following
# and specify the fully qualified class name to the JavaScript interface
# class:
#-keepclassmembers class fqcn.of.javascript.interface.for.webview {
#   public *;
#}

# Uncomment this to preserve the line number information for
# debugging stack traces.
#-keepattributes SourceFile,LineNumberTable

# If you keep the line number information, uncomment this to
# hide the original source file name.
#-renamesourcefileattribute SourceFile

# ---------------------------------------------------------------------------
# Month-2 native additions: keep all receiver / provider / plugin classes
# alive on release builds (R8 is enabled via isMinifyEnabled = true).
# Receivers and providers are instantiated reflectively by the system from
# the manifest, so R8 would otherwise strip them.
# ---------------------------------------------------------------------------
-keep class net.todotxt.app.plugins.exactalarms.** { *; }
-keep class net.todotxt.app.plugins.widgetdata.** { *; }
-keepclassmembers class net.todotxt.app.MainActivity {
    public *;
}
