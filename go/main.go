package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
	"time"
)

func main() {
	start := time.Now()

	resc, errc := make(chan string), make(chan error)

	data, err := ioutil.ReadFile("../sites.txt")
	if err != nil {
		panic(err)
	}
	sites := strings.Split(string(data), "\n")
	for _, site := range sites {
		go func(url string) {
			start := time.Now()
			resp, err := http.Get(url)
			if err != nil {
				errc <- err
				return
			}
			elapsed := time.Since(start)
			resc <- fmt.Sprintf("%v %v %v %v", url, resp.StatusCode, http.StatusText(resp.StatusCode), elapsed)
		}("https://" + site)
	}

	for i := 0; i < len(sites); i++ {
		select {
		case res := <-resc:
			fmt.Println(res)

		case err := <-errc:
			fmt.Println(err)
		}
	}
	elapsed := time.Since(start)
	fmt.Println("Benchmark:", elapsed)
}