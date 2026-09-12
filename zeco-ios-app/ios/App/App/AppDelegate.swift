import UIKit
import Capacitor

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        return true
    }

    func applicationWillResignActive(_ application: UIApplication) {
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
    }

    func applicationWillTerminate(_ application: UIApplication) {
    }

    // MARK: - Push notifications
    // NOTE: manual NotificationCenter forwarding for push notifications was
    // removed here because the installed Capacitor version handles APNs
    // registration and remote notification delivery automatically via method
    // swizzling on this AppDelegate. The web-side JS in www/native-bridge.js
    // still receives events the same way, via Capacitor's PushNotifications
    // plugin listeners (addListener('registration', ...) and
    // addListener('pushNotificationReceived', ...)) - no manual wiring needed.
    // See https://capacitorjs.com/docs/apis/push-notifications#ios

    func application(_ application: UIApplication,
                     configurationForConnecting connectingSceneSession: UISceneSession,
                     options: UIScene.ConnectionOptions) -> UISceneConfiguration {
        let config = UISceneConfiguration(name: "Default Configuration",
                                          sessionRole: connectingSceneSession.role)
        config.delegateClass = SceneDelegate.self
        return config
    }
}
