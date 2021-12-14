import { Injectable } from '@angular/core';

export enum LogLevel {
  Off = 0,
  Custom,
  Error,
  Warning,
  Info,
  Debug,
}

/**
 * Log output handler function.
 */
export type LogOutput = (source: string | undefined, level: LogLevel, ...objects: any[]) => void;


@Injectable({
  providedIn: 'root'
})


export class Logger {
  constructor() { }
  /**
   * Current logging level.
   * Set it to LogLevel.Off to disable logs completely.
   */
  static level = LogLevel.Debug;

  /**
   * Additional log outputs.
   */
  static outputs: LogOutput[] = [];

  /**
   * Enables production mode.
   * Sets logging level to LogLevel.Warning.
   */
  public enableProductionMode() {
    Logger.level = LogLevel.Error;
  }

  /**
   * Logs messages or objects  with the debug level.
   * Works the same as console.log().
   */
  public debug(source: string, ...objects: any[]) {
    this.log(source, console.log, LogLevel.Debug, objects);
  }

  /**
   * Logs messages or objects  with the info level.
   * Works the same as console.log().
   */
  public info(source: string, ...objects: any[]) {
    // tslint:disable-next-line:no-console
    this.log(source, console.info, LogLevel.Info, objects);
  }

  /**
   * Logs messages or objects  with the warning level.
   * Works the same as console.log().
   */
  public warn(source: string, ...objects: any[]) {
    this.log(source, console.warn, LogLevel.Warning, objects);
  }

  /**
   * Logs messages or objects  with the error level.
   * Works the same as console.log().
   */
  public error(source: string, ...objects: any[]) {
    this.log(source, console.error, LogLevel.Error, objects);
  }

  /**
   * @function log
   * @param source
   * @param func
   * @param level
   * @param objects
   * @description log messages and events
   */
  private log(source: string, func: (...args: any[]) => void, level: LogLevel, objects: any[]) {
    const log = ['[' + source + '] ::'].concat(objects);
    if (level <= Logger.level) {
      func.apply(console, log);
      Logger.outputs.forEach((output) => output.apply(output, [source, level, objects]));
    }
  }
}