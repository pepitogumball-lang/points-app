# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# ============================================================================
# Points App - ProGuard Rules for Supabase + React + Capacitor
# ============================================================================

# Keep all Supabase classes
-keep class com.supabase.** { *; }
-keep interface com.supabase.** { *; }

# Keep JavaScript interface methods
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Keep Capacitor classes
-keep class com.getcapacitor.** { *; }
-keep interface com.getcapacitor.** { *; }
-keep class com.getcapacitor.plugins.** { *; }

# Keep annotations
-keepattributes *Annotation*
-keepattributes Signature
-keepattributes EnclosingMethod
-keepattributes InnerClasses
-keepattributes LineNumberTable
-keepattributes SourceFile

# Keep enum values
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

# Keep serializable classes
-keepclassmembers class * implements java.io.Serializable {
    static final long serialVersionUID;
    private static final java.io.ObjectStreamField[] serialPersistentFields;
    private void writeObject(java.io.ObjectOutputStream);
    private void readObject(java.io.ObjectInputStream);
    java.lang.Object writeReplace();
    java.lang.Object readResolve();
}

# Keep native methods
-keepclasseswithmembernames class * {
    native <methods>;
}

# Keep WebView JavaScript interface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Suppress warnings
-dontwarn com.supabase.**
-dontwarn com.getcapacitor.**
-dontwarn org.apache.http.**
-dontwarn android.net.http.**
-dontwarn com.android.internal.http.HttpDateTime

# Optimization settings
-optimizationpasses 5
-dontusemixedcaseclassnames
-verbose

# Keep Points App classes
-keep class com.pepitogumball.points.** { *; }
-keep interface com.pepitogumball.points.** { *; }
