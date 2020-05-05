import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:webview_flutter/webview_flutter.dart';

void main() {
  SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle(
    statusBarColor: Color.fromRGBO(0, 16, 48, 1),
    statusBarBrightness: Brightness.dark,
  ));

  return runApp(App());
}

class App extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    WebViewController webView;

    return MaterialApp(
      home: WillPopScope(
        onWillPop: () async {
          if (await webView.canGoBack()) {
            webView.goBack();
            return false;
          }

          return true;
        },
        child: Container(
          color: Color.fromRGBO(0, 16, 48, 1),
          child: SafeArea(
            child: WebView(
              initialUrl: 'https://hanabi.cards',
              javascriptMode: JavascriptMode.unrestricted,
              gestureNavigationEnabled: true,
              onWebViewCreated: (WebViewController controller) {
                webView = controller;
              },
            ),
          ),
        ),
      ),
    );
  }
}
