import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function ImageOptimizer() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Image Optimizer</CardTitle>
          <CardDescription>
            Optimize images for your therapy practice website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 bg-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/25">
            <div className="text-center space-y-2">
              <div className="text-2xl font-semibold text-muted-foreground">
                Coming Soon!
              </div>
              <p className="text-muted-foreground">
                This tool is currently under development and will be available soon.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
