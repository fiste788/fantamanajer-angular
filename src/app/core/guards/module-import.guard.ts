import { NgModule } from '@angular/core';

export const throwIfAlreadyLoaded = (parentModule: NgModule | null, moduleName: string): void => {
  if (parentModule !== null) {
    throw new Error(
      `${moduleName} has already been loaded. Import ${moduleName} modules in the AppModule only.`,
    );
  }
};
