import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

class Screen1 extends Component {
  constructor() {
    super();

    this.state = {
      backgroundColor: 'rgb(255,255,255)',
      textColor: 'rgb(0,0,0)',
    };
  }

  randomColor = () => {
    const randNum = () => Math.round(Math.random() * 255);
    return `rgb(${randNum()},${randNum()},${randNum()})`;
  };

  render() {
    const { backgroundColor, textColor } = this.state;

    return (
      <View style={[styles.container, { backgroundColor }]}>
        <Text style={[styles.welcomeText, { color: textColor }]}>{'Walkthrough\nExample App'}</Text>
        <TouchableOpacity>
          <View style={styles.startButton}>
            <Text style={styles.startButtonText}>Start Walkthrough</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.footer}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.footerButton}
            onPress={() => this.setState({ backgroundColor: this.randomColor() })}
          >
            <Text style={styles.footerButtonText}>{'Change\nBackground Color'}</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity
            activeOpacity={1}
            style={styles.footerButton}
            onPress={() => this.setState({ textColor: this.randomColor() })}
          >
            <Text style={styles.footerButtonText}>{'Change\nText Color'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: 'black',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  startButtonText: {
    color: '#f5f5f5',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    width: '90%',
    backgroundColor: '#ddd',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bbb',
  },
  footerButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  footerButtonText: {
    color: 'black',
    textAlign: 'center',
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    height: '100%',
    backgroundColor: '#333',
  },
});

export default Screen1;
