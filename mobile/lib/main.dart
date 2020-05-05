import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_webview_plugin/flutter_webview_plugin.dart';
import 'package:uni_links/uni_links.dart';

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
    return MaterialApp(
      theme: new ThemeData(
        scaffoldBackgroundColor: Color.fromRGBO(0, 16, 48, 1),
      ),
      home: WebView(),
    );
  }
}

class WebView extends StatefulWidget {
  @override
  WebViewState createState() => WebViewState();
}

class WebViewState extends State<WebView> {
  final _webView = FlutterWebviewPlugin();

  StreamSubscription _sub;

  @override
  void initState() {
    super.initState();

    getInitialLink().then((initialLink) {
      if (initialLink != null) {
        _webView.reloadUrl(initialLink);
      }
    });

    _sub = getLinksStream().listen((link) {
      if (link != null) {
        _webView.reloadUrl(link);
      }
    });
  }

  @override
  void dispose() {
    super.dispose();
    _webView.dispose();

    if (_sub != null) {
      _sub.cancel();
    }
  }

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () async {
        if (await _webView.canGoBack()) {
          _webView.goBack();
          return false;
        }

        return true;
      },
      child: SafeArea(
        child: WebviewScaffold(
          url: 'https://hanabi.cards',
          withJavascript: true,
          withZoom: false,
          withLocalStorage: true,
        ),
      ),
    );
  }
}
