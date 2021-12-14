import { HttpRequestService } from './http-request.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Type } from '@angular/core';
import { Logger } from '../../core/logger.service';

describe('http-request-service', () => {
    let mockHttpRequestService: HttpRequestService;
    let http: HttpClient;
    let logger: Logger;
    let httpMock: HttpTestingController;
    let responseData: any;
    const mockResponseData = 'unittesting';
    const environmentUrl = 'http://localhost:3000/';

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [HttpClient]
        });
        http = TestBed.get(HttpClient);
        logger = TestBed.get(Logger);
        httpMock = TestBed.get(HttpTestingController as Type<HttpTestingController>);

    });
    beforeEach(() => {
        mockHttpRequestService = new HttpRequestService(http, logger);

    });
    afterEach(() => {
        httpMock.verify();
    });

    it('should create an instance', () => {
        expect(new HttpRequestService(TestBed.get(HttpClient), TestBed.get(Logger))).toBeTruthy();
    });

    it('should call and verify the get menthod', () => {
        mockHttpRequestService.get('toto').toPromise().then((response) => { responseData = response; });

        // Assert
        const req = httpMock.expectOne({ url: environmentUrl + 'toto' });
        req.flush(mockResponseData);
    });

    it('should call error handle the get method', () => {
        const mockData: string = 'Test incident data';
        const errorMock = { status: 404, statusText: 'Not Found' };
        console.log("Get error handling");
        const mockErrorResponse: HttpErrorResponse = new HttpErrorResponse({
            error: {}, status: 500, url: environmentUrl + 'mocktest', statusText: 'Bad Request'
        });
        mockHttpRequestService.get('mocktest').subscribe((resp) => {
            console.log('handleError on create: expected error response:');
            console.log(JSON.stringify(resp));
            new Error('handleError: expected error...');
        }, (error) => {
            console.log("Inside the GET");
            expect(mockHttpRequestService.handleError).toHaveBeenCalledWith(error, 'GET', environmentUrl + 'mocktest');
        }
        );

        const req: TestRequest = httpMock.expectOne({ url: environmentUrl + 'mocktest' });
        expect(req.request.method).toBe('GET');
        req.flush(mockErrorResponse);

    });

    it('handleError :: should throwback error for https methods', () => {
        const mockErrorResponse: HttpErrorResponse = new HttpErrorResponse({
            error: {}, status: 500, url: environmentUrl + 'mocktest', statusText: 'Bad Request'
        });

        const req = mockHttpRequestService.handleError(mockErrorResponse, 'GET', environmentUrl + 'mocktest');

        expect(req).toThrowError;

    });

    it('should call and verify the post method', () => {
        mockHttpRequestService.post('postrequest', {}).toPromise().then((response) => response);

        // Assert
        let req = httpMock.expectOne({ url: environmentUrl + 'postrequest' });
        req.flush(mockResponseData);
        expect(req.request.url).toBe(environmentUrl + 'postrequest');
        expect(req.request.body).toEqual({});

        mockHttpRequestService.post('postrequest', {}, { responseType: 'text' }).toPromise().then((response) => { responseData = response; });

        // Assert
        req = httpMock.expectOne({ url: environmentUrl + 'postrequest' });
        req.flush(mockResponseData);
        expect(req.request.url).toBe(environmentUrl + 'postrequest');
        expect(req.request.body).toEqual({});
    });
    it('should call and verify the put method', () => {
        mockHttpRequestService.put('putrequest', {}).toPromise().then((response) => response);

        // Assert
        let req = httpMock.expectOne({ url: environmentUrl + 'putrequest' });
        req.flush(mockResponseData);
        expect(req.request.url).toBe(environmentUrl + 'putrequest');
        expect(req.request.body).toEqual({});

        mockHttpRequestService.put('putrequest', {}, { responseType: 'text' }).toPromise().then((response) => { responseData = response; });

        // Assert
        req = httpMock.expectOne({ url: environmentUrl + 'putrequest' });
        req.flush(mockResponseData);
        expect(req.request.url).toBe(environmentUrl + 'putrequest');
        expect(req.request.body).toEqual({});
    });
    it('should call and verify the delete method', () => {

        mockHttpRequestService.delete('deleterequest', {}).toPromise().then((response) => { responseData = response; });

        // Assert
        const req = httpMock.expectOne({ url: environmentUrl + 'deleterequest' });
        req.flush(mockResponseData);
        expect(req.request.url).toBe(environmentUrl + 'deleterequest');
    });

});
