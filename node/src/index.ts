import fs from 'fs'
import path from 'path'
import axios from 'axios'

const FILEPATH = path.resolve(`${__dirname}/../../sites.txt`)
const file = fs.readFileSync(FILEPATH)
const sites = file.toString().split('\n')

interface ISiteStatusCode {
  site: string,
  statusCode: number
}

async function startBenchmark(): Promise<ISiteStatusCode[]> {
  console.time("benchmark")
  const calls = sites.map(getSiteStatusCode)
  const responses = await Promise.allSettled(calls).then(data => data).catch(error => error)
  return responses.map((response: any) => response.value).filter(Boolean)
}

function endBenchmark(results: ISiteStatusCode[]): void {
  console.log(`${results.length} sites`)
  console.timeEnd("benchmark")
  process.exit(0)
}

async function getSiteStatusCode(site: string): Promise<ISiteStatusCode> {
  console.time(site)
  const response = await axios.get(`https://${site}`)
  console.timeEnd(site)
  console.log(`${response.status} ${response.statusText}`)
  return { site, statusCode: response.status }
}

startBenchmark().then(endBenchmark).catch(console.error)


