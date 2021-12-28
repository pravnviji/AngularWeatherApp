import { Type } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { HTTP_INTERCEPTORS, HttpClient } from "@angular/common/http";

import { environment } from "../../../environments/environment";
import { ApiPrefixInterceptor } from "./api-prefix.interceptor";

describe("ApiPrefixInterceptor", () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ApiPrefixInterceptor,
          multi: true,
        },
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(
      HttpTestingController as Type<HttpTestingController>
    );
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should prepend environment.serverUrl to the request url", () => {
    // Act
    http.get("/gmbh-ankaufen").subscribe();

    // Assert
    httpMock.expectOne({ url: "/gmbh-ankaufen" });
  });

  it("should not prepend environment.serverUrl to request url", () => {
    // Act
    http.get("https://gmbh-now.com/gmbh-ankaufen/").subscribe();

    // Assert
    httpMock.expectOne({ url: "https://gmbh-now.com/gmbh-ankaufen/" });
  });
});
